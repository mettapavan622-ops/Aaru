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
    return 'Email not confirmed. Please check your inbox and click the confirmation link sent by Supabase.';
  }

  if (message.includes('invalid format') || message.includes('valid email')) {
    return 'Please enter a valid email address.';
  }

  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'Too many login attempts. Please wait a moment and try again.';
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
    id: supabaseUser.id,
    email,
    name,
    phone,
    role: userRole,
    status: fallbackData?.status || 'ACTIVE',
    createdAt: supabaseUser.created_at || new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };
};

/**
 * Ask the AARU backend to hydrate the persistent profile and return the
 * server-authoritative role/status/cart/wishlist/orders for this Supabase user.
 */
export const syncBackendSession = async (accessToken: string) => {
  const response = await fetch('/api/auth/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Unable to synchronize your AARU account.');
  }
  return result;
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

  const trimmedEmail = email.toLowerCase();

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
  if (!isSupabaseConfigured()) {
    throw new Error('AARU authentication is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the environment.');
  }

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

  if (error) throw new Error(parseSupabaseAuthError(error));
  if (!data.user) throw new Error('Account could not be created. Please try again.');

  if (Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    throw new Error('User already exists. An account with this email is already registered. Please sign in instead.');
  }

  // If email confirmation is enabled, Supabase intentionally returns no session.
  // The account is still permanently stored in Supabase Auth.
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
  if (!isSupabaseConfigured()) {
    throw new Error('AARU authentication is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the environment.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password
  });

  if (error) throw new Error(parseSupabaseAuthError(error));
  if (!data.user || !data.session) throw new Error('Authentication succeeded but no active session was returned.');

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
};

export const signInAdminWithSupabase = async (email: string, password: string) => {
  const data = await signInWithSupabase(email, password);
  if (data.user.role !== 'ADMIN') {
    await supabase.auth.signOut();
    throw new Error('Invalid administrator email or password.');
  }
  return data;
};
