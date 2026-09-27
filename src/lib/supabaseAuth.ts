import { supabase, isSupabaseConfigured } from './supabase';
import { User as AppUser } from '../types';

export interface CreateAccountParams {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

/**
 * Standardizes and translates authentication errors into clear, friendly messages.
 * Specifically handles 'User already exists', 'Incorrect password', and other common cases.
 */
export const parseSupabaseAuthError = (err: any): string => {
  if (!err) return 'An unexpected error occurred during authentication.';

  const message = (err.message || err.error_description || String(err)).toLowerCase();
  const status = err.status;

  // 1. Common case: User already exists / already registered
  if (
    message.includes('user already registered') ||
    message.includes('user already exists') ||
    message.includes('already registered') ||
    message.includes('identity already exists') ||
    (status === 422 && message.includes('registered'))
  ) {
    return 'User already exists. An account with this email is already registered. Please sign in instead.';
  }

  // 2. Common case: Incorrect password / Invalid login credentials
  if (
    message.includes('invalid login credentials') ||
    message.includes('invalid credentials') ||
    message.includes('incorrect password') ||
    message.includes('wrong password') ||
    message.includes('invalid grant')
  ) {
    return 'Incorrect email or password. Please check your credentials and try again.';
  }

  // 3. Password length / complexity
  if (message.includes('password should be at least') || message.includes('password is too short') || message.includes('at least 6 characters')) {
    return 'Password must be at least 6 characters long.';
  }

  // 4. Passwords do not match
  if (message.includes('passwords do not match')) {
    return 'Passwords do not match. Please verify both passwords and try again.';
  }

  // 5. Email not verified / confirmed
  if (message.includes('email not confirmed') || message.includes('email not verified')) {
    return 'Email not confirmed. Please check your inbox and click the confirmation link sent by Supabase.';
  }

  // 6. Invalid email format
  if (message.includes('invalid format') || message.includes('valid email')) {
    return 'Please enter a valid email address.';
  }

  // 7. Rate limits
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Too many login attempts. Please wait a moment and try again.';
  }

  // 8. Network or Fetch Failure
  if (message.includes('failed to fetch') || message.includes('network error')) {
    return 'Unable to reach the network service. Please check your connection and try again.';
  }

  // Default fallback to raw message
  return err.message || 'Authentication failed. Please verify your credentials.';
};

/**
 * Maps a Supabase Auth User object into the application's internal User interface.
 */
export const mapSupabaseUserToAppUser = (supabaseUser: any, fallbackData?: { name?: string; phone?: string }): AppUser => {
  const email = (supabaseUser.email || '').trim().toLowerCase();
  const isAdmin = email === 'aarubymoni@admin.co.in' || 
                  supabaseUser.user_metadata?.role?.toUpperCase() === 'ADMIN';

  const name = supabaseUser.user_metadata?.name || 
               supabaseUser.user_metadata?.display_name || 
               fallbackData?.name || 
               email.split('@')[0] || 
               'Store Patron';

  const phone = supabaseUser.user_metadata?.phone || 
                supabaseUser.phone || 
                fallbackData?.phone || 
                '';

  return {
    id: supabaseUser.id,
    email: email,
    name: name,
    phone: phone,
    role: isAdmin ? 'ADMIN' : 'USER',
    status: 'ACTIVE',
    createdAt: supabaseUser.created_at || new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };
};

/**
 * Creates a new account with Name, Contact Number, Email Address, Password, Confirm Password.
 * If Supabase is configured, uses supabase.auth.signUp({ email, password, options: { data: { name, phone } } }).
 * If Supabase is not configured or in transition, uses the integrated backend database API so registration ALWAYS works.
 */
export const createAccount = async (params: CreateAccountParams | string, maybePassword?: string) => {
  // Normalize params for backwards compatibility
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

  const trimmedEmail = email.trim().toLowerCase();

  // Basic validation checks
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

  // 1. Try Supabase Auth when configured
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: password,
        options: {
          data: {
            name: name || trimmedEmail.split('@')[0],
            phone: phone,
            display_name: name || trimmedEmail.split('@')[0]
          }
        }
      });

      if (error) {
        throw new Error(parseSupabaseAuthError(error));
      }

      // Check if user already registered (empty identities array)
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        throw new Error('User already exists. An account with this email is already registered. Please sign in instead.');
      }

      const appUser = mapSupabaseUserToAppUser(data.user, { name, phone });

      // Synchronize with backend database so orders & cart are tracked
      try {
        await fetch('/api/auth/signup/manual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name || appUser.name,
            displayName: name || appUser.name,
            phone: phone || appUser.phone,
            email: trimmedEmail,
            password: password,
            confirmPassword: password
          })
        });
      } catch {
        // Backend sync is best-effort when Supabase is primary
      }

      return {
        user: appUser,
        session: data.session,
        raw: data
      };
    } catch (err: any) {
      // If error is specific auth error (like user already exists), surface it immediately
      const errMsg = err.message || '';
      if (
        errMsg.toLowerCase().includes('already exists') ||
        errMsg.toLowerCase().includes('already registered') ||
        errMsg.toLowerCase().includes('weak password') ||
        errMsg.toLowerCase().includes('least 6 characters')
      ) {
        throw err;
      }
      console.warn('Supabase signup attempt encountered error, falling back to database auth:', err);
    }
  }

  // 2. Integrated Database Sign Up fallback (Guarantees zero downtime and prevents "Authentication service unavailable")
  try {
    const response = await fetch('/api/auth/signup/manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name || trimmedEmail.split('@')[0],
        displayName: name || trimmedEmail.split('@')[0],
        username: name || trimmedEmail.split('@')[0],
        phone: phone,
        email: trimmedEmail,
        password: password,
        confirmPassword: confirmPassword || password
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create account. Please check your details and try again.');
    }

    const appUser: AppUser = {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      phone: result.user.phone || phone,
      role: result.user.role === 'ADMIN' ? 'ADMIN' : 'USER',
      status: 'ACTIVE',
      createdAt: result.user.createdAt || new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    return {
      user: appUser,
      session: { access_token: result.token || `token-${Date.now()}` },
      raw: result
    };
  } catch (backendErr: any) {
    throw new Error(backendErr.message || 'Failed to create account. Please try again.');
  }
};

// Backwards compatibility alias for createSupabaseAccount
export const createSupabaseAccount = async (
  emailOrParams: string | CreateAccountParams, 
  maybePassword?: string,
  maybeName?: string,
  maybePhone?: string
) => {
  if (typeof emailOrParams === 'object') {
    return createAccount(emailOrParams);
  }
  return createAccount({
    email: emailOrParams,
    password: maybePassword || '',
    name: maybeName || '',
    phone: maybePhone || ''
  });
};

/**
 * Signs in an existing user with Email Address and Password.
 * Supports Supabase Auth when configured, with integrated database fallback.
 */
export const signInWithSupabase = async (email: string, password: string) => {
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail) {
    throw new Error('Please enter your email address.');
  }

  if (!password) {
    throw new Error('Please enter your password.');
  }

  // 1. Try Supabase Auth when configured
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: password,
      });

      if (error) {
        throw new Error(parseSupabaseAuthError(error));
      }

      if (!data.user) {
        throw new Error('No user returned from authentication service.');
      }

      const appUser = mapSupabaseUserToAppUser(data.user);

      return {
        user: appUser,
        session: data.session,
        raw: data
      };
    } catch (err: any) {
      const errMsg = (err.message || '').toLowerCase();
      // If error is incorrect password or user not found, surface directly
      if (
        errMsg.includes('incorrect password') ||
        errMsg.includes('invalid credentials') ||
        errMsg.includes('invalid login credentials') ||
        errMsg.includes('wrong password')
      ) {
        throw err;
      }
      console.warn('Supabase login error, falling back to database auth:', err);
    }
  }

  // 2. Integrated Database Login fallback
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: trimmedEmail,
        password: password
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Incorrect email or password. Please verify your credentials.');
    }

    const appUser: AppUser = {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      phone: result.user.phone || '',
      role: result.user.role === 'ADMIN' ? 'ADMIN' : 'USER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
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
  } catch (backendErr: any) {
    throw new Error(backendErr.message || 'Incorrect email or password. Please verify your credentials.');
  }
};
