import { supabase, isSupabaseConfigured } from './supabase';
import { User as AppUser } from '../types';

export interface CreateAccountParams {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export const parseSupabaseAuthError = (err: any): string => {
  if (!err) return 'An unexpected error occurred during authentication.';

  const message = (err.message || err.error_description || String(err)).toLowerCase();
  const status = err.status;

  if (
    message.includes('user already registered') ||
    message.includes('user already exists') ||
    message.includes('already registered') ||
    message.includes('already been registered') ||
    message.includes('identity already exists') ||
    (status === 422 && message.includes('registered'))
  ) {
    return 'User already exists. An account with this email is already registered. Please sign in instead.';
  }

  if (
    message.includes('invalid login credentials') ||
    message.includes('invalid credentials') ||
    message.includes('incorrect password') ||
    message.includes('wrong password') ||
    message.includes('invalid grant')
  ) {
    return 'Incorrect email or password. Please check your credentials and try again.';
  }

  if (
    message.includes('password should be at least') ||
    message.includes('password is too short') ||
    message.includes('at least 6 characters')
  ) {
    return 'Password must be at least 6 characters long.';
  }

  if (message.includes('passwords do not match')) {
    return 'Passwords do not match. Please verify both passwords and try again.';
  }

  if (message.includes('email not confirmed') || message.includes('email not verified')) {
    return 'Email not confirmed. Please check your inbox or sign in with your password.';
  }

  if (message.includes('invalid format') || message.includes('valid email')) {
    return 'Please enter a valid email address.';
  }

  if (message.includes('over_email_send_rate_limit') || message.includes('email rate limit')) {
    return 'Email verification rate limit reached. Your account is ready—please sign in with your email and password.';
  }

  if (message.includes('rate limit') || message.includes('too many requests') || message.includes('too many attempts')) {
    return 'Too many requests. Please wait a moment and try again.';
  }

  if (message.includes('failed to fetch') || message.includes('network error')) {
    return 'Unable to reach the authentication service. Please check your connection and try again.';
  }

  return err.message || 'Authentication failed. Please verify your credentials.';
};

export const mapSupabaseUserToAppUser = (
  supabaseUser: any,
  fallbackData?: { name?: string; phone?: string; role?: 'USER' | 'ADMIN'; status?: 'ACTIVE' | 'SUSPENDED' | 'REVOKED' }
): AppUser => {
  const email = (supabaseUser?.email || '').trim().toLowerCase();
  const metadataRole = String(supabaseUser?.app_metadata?.role || '').toUpperCase();
  const userRole = metadataRole === 'ADMIN' || fallbackData?.role === 'ADMIN' ? 'ADMIN' : 'USER';

  const name =
    supabaseUser?.user_metadata?.name ||
    supabaseUser?.user_metadata?.display_name ||
    fallbackData?.name ||
    email.split('@')[0] ||
    'Store Patron';

  const phone =
    supabaseUser?.user_metadata?.phone ||
    supabaseUser?.phone ||
    fallbackData?.phone ||
    '';

  return {
    id: supabaseUser?.id || `usr-${Date.now()}`,
    email,
    name,
    phone,
    role: userRole,
    status: fallbackData?.status || 'ACTIVE',
    createdAt: supabaseUser?.created_at || new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };
};

/**
 * Ask the AARU backend to hydrate the persistent profile and return the
 * server-authoritative role/status/cart/wishlist/orders for this Supabase user.
 */
export const syncBackendSession = async (accessToken: string) => {
  try {
    const response = await fetch('/api/auth/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    });

    const result = await response.json().catch(() => ({}));
    if (response.ok && result.success) {
      return result;
    }
  } catch (err) {
    console.warn('[Session Sync Warning]:', err);
  }
  return { success: false, cart: [], wishlist: [], orders: [] };
};

export const createAccount = async (params: CreateAccountParams | string, maybePassword?: string) => {
  let name = '';
  let phone = '';
  let email = '';
  let password = '';
  let confirmPassword = '';

  if (typeof params === 'string') {
    email = params;
    password = maybePassword || '';
  } else {
    name = (params.name || '').trim();
    phone = (params.phone || '').trim();
    email = (params.email || '').trim();
    password = params.password || '';
    confirmPassword = params.confirmPassword || '';
  }

  const trimmedEmail = email.toLowerCase().trim();

  if (name && name.length < 2) {
    throw new Error('Please enter your full name (at least 2 characters).');
  }
  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    throw new Error('Please enter a valid email address.');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }
  if (confirmPassword && password !== confirmPassword) {
    throw new Error('Passwords do not match. Please re-enter both passwords.');
  }

  // 1. Primary Path: Create account via server endpoint
  // Using server-side Supabase Admin client bypasses client-side email rate limits
  // (over_email_send_rate_limit) because it confirms the email instantly and sets up profile metadata.
  try {
    const response = await fetch('/api/auth/signup/manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name || trimmedEmail.split('@')[0],
        displayName: name || trimmedEmail.split('@')[0],
        username: name || trimmedEmail.split('@')[0],
        phone: phone || '',
        email: trimmedEmail,
        password: password,
        confirmPassword: confirmPassword || password
      })
    });

    const result = await response.json().catch(() => ({}));

    if (response.ok && result.success) {
      // User created/confirmed in Supabase. Now sign in on the client to obtain the active JWT session.
      try {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: password
        });

        if (!signInError && signInData?.session && signInData?.user) {
          const appUser = mapSupabaseUserToAppUser(signInData.user, {
            name: result.user?.name || name,
            phone: result.user?.phone || phone,
            role: result.user?.role,
            status: result.user?.status
          });

          return {
            user: appUser,
            session: signInData.session,
            raw: signInData,
            cart: result.cart || [],
            wishlist: result.wishlist || [],
            orders: result.orders || []
          };
        }
      } catch {
        // If client sign in throws an unexpected error, proceed with the server's user response
      }

      const fallbackAppUser: AppUser = {
        id: result.user?.id || `usr-${Date.now()}`,
        email: result.user?.email || trimmedEmail,
        name: result.user?.name || name || trimmedEmail.split('@')[0],
        phone: result.user?.phone || phone || '',
        role: result.user?.role === 'ADMIN' ? 'ADMIN' : 'USER',
        status: 'ACTIVE',
        createdAt: result.user?.createdAt || new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      return {
        user: fallbackAppUser,
        session: { access_token: result.token || `token-${Date.now()}` },
        raw: result,
        cart: result.cart || [],
        wishlist: result.wishlist || [],
        orders: result.orders || []
      };
    }

    if (!response.ok && result.error) {
      const errLower = result.error.toLowerCase();
      if (errLower.includes('already registered') || errLower.includes('already exists') || errLower.includes('duplicate')) {
        throw new Error('User already exists. An account with this email is already registered. Please sign in instead.');
      }
      throw new Error(result.error);
    }
  } catch (backendErr: any) {
    const errLower = (backendErr?.message || '').toLowerCase();
    if (
      errLower.includes('already exists') || 
      errLower.includes('already registered') || 
      errLower.includes('passwords do not match') ||
      errLower.includes('least 6 characters')
    ) {
      throw backendErr;
    }
    console.warn('[Signup] Server route attempt notice:', backendErr.message);
  }

  // 2. Direct client-side Supabase sign up (fallback if backend unreachable)
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          name: name || trimmedEmail.split('@')[0],
          phone,
          display_name: name || trimmedEmail.split('@')[0]
        }
      }
    });

    if (error) {
      const errMsg = (error.message || '').toLowerCase();
      // If client hits email rate limit, attempt direct sign in
      if (errMsg.includes('rate limit') || errMsg.includes('over_email_send_rate_limit')) {
        try {
          const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password
          });
          if (!signInErr && signInData?.session && signInData?.user) {
            const appUser = mapSupabaseUserToAppUser(signInData.user, { name, phone });
            return {
              user: appUser,
              session: signInData.session,
              raw: signInData,
              cart: [],
              wishlist: [],
              orders: []
            };
          }
        } catch {
          // continue to throw parsed error
        }
      }
      throw new Error(parseSupabaseAuthError(error));
    }

    if (!data.user) throw new Error('Account could not be created. Please try again.');

    if (Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      throw new Error('User already exists. An account with this email is already registered. Please sign in instead.');
    }

    if (!data.session) {
      return {
        user: mapSupabaseUserToAppUser(data.user, { name, phone }),
        session: null,
        emailConfirmationRequired: true,
        raw: data
      };
    }

    const synced = await syncBackendSession(data.session.access_token);
    const appUser = mapSupabaseUserToAppUser(data.user, {
      name: synced.user?.name || name,
      phone: synced.user?.phone || phone,
      role: synced.user?.role,
      status: synced.user?.status
    });

    return {
      user: appUser,
      session: data.session,
      raw: data,
      cart: synced.cart || [],
      wishlist: synced.wishlist || [],
      orders: synced.orders || []
    };
  }

  throw new Error('AARU authentication is not configured.');
};

export const createSupabaseAccount = async (
  emailOrParams: string | CreateAccountParams,
  maybePassword?: string,
  maybeName?: string,
  maybePhone?: string
) => {
  if (typeof emailOrParams === 'object') return createAccount(emailOrParams);
  return createAccount({
    email: emailOrParams,
    password: maybePassword || '',
    name: maybeName || '',
    phone: maybePhone || ''
  });
};

export const signInWithSupabase = async (email: string, password: string) => {
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail) throw new Error('Please enter your email address.');
  if (!password) throw new Error('Please enter your password.');

  // 1. Direct Supabase signInWithPassword
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password
      });

      if (!error && data?.user && data?.session) {
        const synced = await syncBackendSession(data.session.access_token);
        const appUser = mapSupabaseUserToAppUser(data.user, {
          name: synced.user?.name,
          phone: synced.user?.phone,
          role: synced.user?.role,
          status: synced.user?.status
        });

        return {
          user: appUser,
          session: data.session,
          raw: data,
          cart: synced.cart || [],
          wishlist: synced.wishlist || [],
          orders: synced.orders || []
        };
      }

      if (error) {
        const errLower = (error.message || '').toLowerCase();
        if (
          errLower.includes('invalid login credentials') ||
          errLower.includes('incorrect password') ||
          errLower.includes('wrong password')
        ) {
          throw new Error('Incorrect email or password. Please check your credentials and try again.');
        }
        if (errLower.includes('email not confirmed')) {
          // Try confirming via server admin client
          try {
            const res = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: trimmedEmail, password })
            });
            const backData = await res.json().catch(() => ({}));
            if (res.ok && backData.success) {
              // Now that it's confirmed, re-try client sign-in
              const { data: retryData } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password });
              if (retryData?.session && retryData?.user) {
                return {
                  user: mapSupabaseUserToAppUser(retryData.user, backData.user),
                  session: retryData.session,
                  cart: backData.cart || [],
                  wishlist: backData.wishlist || [],
                  orders: backData.orders || []
                };
              }
            }
          } catch {
            // fall through
          }
          throw new Error('Email not confirmed. Please check your inbox or reset your password.');
        }
        throw new Error(parseSupabaseAuthError(error));
      }
    } catch (supabaseErr: any) {
      const errMsg = (supabaseErr.message || '').toLowerCase();
      if (
        errMsg.includes('incorrect email or password') ||
        errMsg.includes('invalid login credentials')
      ) {
        throw supabaseErr;
      }
      console.warn('[Supabase Sign In] Falling back to server login:', supabaseErr.message);
    }
  }

  // 2. Server-side login fallback
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: trimmedEmail, password })
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Incorrect email or password. Please verify your credentials.');
  }

  const appUser: AppUser = {
    id: result.user.id,
    email: result.user.email,
    name: result.user.name,
    phone: result.user.phone || '',
    role: String(result.user.role).toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER',
    status: 'ACTIVE',
    createdAt: result.user.createdAt || new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };

  return {
    user: appUser,
    session: { access_token: result.token || `token-${Date.now()}` },
    raw: result,
    cart: result.cart || [],
    wishlist: result.wishlist || [],
    orders: result.orders || []
  };
};

export const signInAdminWithSupabase = async (email: string, password: string) => {
  const data = await signInWithSupabase(email, password);
  if (data.user.role !== 'ADMIN') {
    await supabase.auth.signOut();
    throw new Error('Invalid administrator email or password.');
  }
  return data;
};
