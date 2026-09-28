import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { AaruLogo } from './AaruLogo';
import { 
  User as UserIcon,
  Phone,
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  X,
  ShieldCheck
} from 'lucide-react';
import { 
  createAccount, 
  signInWithSupabase, 
  parseSupabaseAuthError 
} from '../lib/supabaseAuth';

interface AuthScreenProps {
  onLoginSuccess: (user: User, initialData?: { cart?: any[]; wishlist?: string[]; orders?: any[] }) => void;
  onContinueAsGuest?: () => void;
  isModal?: boolean;
  onClose?: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  onContinueAsGuest,
  isModal = false,
  onClose,
  initialMode = 'login'
}) => {
  // Mode: 'login' | 'signup'
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (initialMode) {
      setAuthMode(initialMode);
    }
  }, [initialMode]);

  // Mode Switcher
  const handleSwitchMode = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // ===========================================================================
  // Sign In Function using Email and Password
  // ===========================================================================
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await signInWithSupabase(cleanEmail, password);

      if (!data.user) {
        throw new Error('No user returned from authentication.');
      }

      const appUser = data.user;

      // Save user session in localStorage for app state continuity
      localStorage.setItem('aaru_user_session', JSON.stringify(appUser));
      if (data.session?.access_token) {
        localStorage.setItem('aaru_auth_token', data.session.access_token);
        localStorage.setItem('aaru_supabase_token', data.session.access_token);
      }

      setSuccessMessage(`Welcome back, ${appUser.name}! Loading your account...`);

      setTimeout(() => {
        onLoginSuccess(appUser, {
          cart: (data as any).cart || [],
          wishlist: (data as any).wishlist || [],
          orders: (data as any).orders || []
        });
        if (onClose) onClose();
      }, 500);
    } catch (err: any) {
      setErrorMessage(parseSupabaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===========================================================================
  // Create Account Function: Name, Contact Number, Email, Password, Confirm Password
  // ===========================================================================
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();

    // 1. Name validation
    if (!cleanName || cleanName.length < 2) {
      setErrorMessage('Please enter your full name (minimum 2 characters).');
      return;
    }

    // 2. Contact Number validation
    if (!cleanPhone || cleanPhone.length < 7) {
      setErrorMessage('Please enter a valid contact number for order & shipping updates.');
      return;
    }

    // 3. Email validation
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // 4. Password validation
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    // 5. Confirm Password validation
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter both passwords.');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await createAccount({
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        password: password,
        confirmPassword: confirmPassword
      });

      if (!data.user) {
        throw new Error('Account could not be created. Please try again.');
      }

      const appUser = data.user;

      // When Supabase email confirmation is enabled, account creation succeeds
      // without creating a browser session. Keep the user on the auth screen.
      if (!data.session) {
        setSuccessMessage('Account created successfully. Please check your email and confirm your account before signing in.');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setAuthMode('login'), 900);
        return;
      }

      // Supabase is the persistent authentication source of truth.
      localStorage.setItem('aaru_user_session', JSON.stringify(appUser));
      localStorage.setItem('aaru_auth_token', data.session.access_token);
      localStorage.setItem('aaru_supabase_token', data.session.access_token);
      
      setSuccessMessage(`Account created successfully! Welcome to AARU Atelier, ${appUser.name}.`);

      setTimeout(() => {
        onLoginSuccess(appUser, {
          cart: (data as any).cart || [],
          wishlist: (data as any).wishlist || [],
          orders: (data as any).orders || []
        });
        if (onClose) onClose();
      }, 500);
    } catch (err: any) {
      setErrorMessage(parseSupabaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      id="aaru-auth-portal"
      className={`${
        isModal 
          ? 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto'
          : 'min-h-screen w-full flex flex-col justify-center items-center py-8 sm:py-12 px-3 sm:px-6 lg:px-8 bg-[#FAF9F5] relative overflow-y-auto'
      }`}
    >
      {/* Background Decorative Accents */}
      {!isModal && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#0F4C5C]/6 blur-3xl" />
          <div className="absolute top-1/2 -left-32 w-96 h-96 rounded-full bg-[#C08081]/8 blur-3xl" />
          <div className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full bg-[#8C6D37]/7 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#8C6D37_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        </div>
      )}

      {/* Main Auth Card */}
      <div 
        id="auth-card-container"
        className="w-full max-w-md bg-white border border-[#D4C7B5] shadow-2xl relative z-10 p-6 sm:p-8 rounded-none my-auto"
      >
        {/* Close Button if Modal */}
        {isModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3.5 right-3.5 p-1.5 text-[#736B5E] hover:text-[#24211E] bg-[#FAF9F5] border border-[#E8DFD5] hover:bg-white transition-colors cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-1">
            <AaruLogo size="md" layout="centered" />
          </div>
          <p className="text-[10px] tracking-[0.2em] text-[#736B5E] uppercase mt-1 select-none font-medium">
            Atelier Authentication
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="grid grid-cols-2 border-b border-[#E8DFD5] mb-6">
          <button
            type="button"
            id="tab-signin-btn"
            onClick={() => handleSwitchMode('login')}
            className={`pb-3 text-xs font-bold uppercase tracking-[0.14em] transition-all cursor-pointer text-center ${
              authMode === 'login'
                ? 'border-b-2 border-[#0F4C5C] text-[#0F4C5C] -mb-[1px]'
                : 'text-[#736B5E] hover:text-[#24211E]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            id="tab-signup-btn"
            onClick={() => handleSwitchMode('signup')}
            className={`pb-3 text-xs font-bold uppercase tracking-[0.14em] transition-all cursor-pointer text-center ${
              authMode === 'signup'
                ? 'border-b-2 border-[#0F4C5C] text-[#0F4C5C] -mb-[1px]'
                : 'text-[#736B5E] hover:text-[#24211E]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#F87171]/40 flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <p className="text-xs text-[#991B1B] font-medium leading-relaxed break-words flex-1">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Success Banner */}
        {successMessage && (
          <div className="mb-4 p-3 bg-[#F0FDF4] border border-[#86EFAC]/40 flex items-start gap-2.5 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
            <p className="text-xs text-[#166534] font-medium leading-relaxed break-words flex-1">
              {successMessage}
            </p>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 1: SIGN IN FORM                                               */}
        {/* =================================================================== */}
        {authMode === 'login' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="signin-email"
                className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1.5"
              >
                Email Address <span className="text-[#C08081]">*</span>
              </label>
              <div className="relative">
                <input
                  id="signin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                />
                <Mail className="w-4 h-4 text-[#736B5E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="signin-password"
                className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1.5"
              >
                Password <span className="text-[#C08081]">*</span>
              </label>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 min-h-[44px] bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                />
                <Lock className="w-4 h-4 text-[#736B5E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  id="toggle-signin-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736B5E] hover:text-[#24211E] cursor-pointer p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Standard Submit Button */}
            <button
              id="signin-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[46px] py-3 px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50 mt-4"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Switch to Create Account */}
            <div className="text-center pt-2">
              <p className="text-xs text-[#736B5E]">
                Don't have an account?{' '}
                <button
                  type="button"
                  id="switch-to-signup-link"
                  onClick={() => handleSwitchMode('signup')}
                  className="font-semibold text-[#0F4C5C] hover:underline cursor-pointer"
                >
                  Create an Account
                </button>
              </p>
            </div>
          </form>
        )}

        {/* =================================================================== */}
        {/* VIEW 2: CREATE ACCOUNT FORM                                        */}
        {/* Fields: Name *, Contact Number *, Email Address *,                 */}
        {/*         Password *, Confirm Password *                             */}
        {/* =================================================================== */}
        {authMode === 'signup' && (
          <form onSubmit={handleCreateAccount} className="space-y-3.5">
            {/* 1. Name Field */}
            <div>
              <label 
                htmlFor="signup-name"
                className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1"
              >
                Name <span className="text-[#C08081]">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aditi Sharma"
                  className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                />
                <UserIcon className="w-4 h-4 text-[#736B5E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 2. Contact Number Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label 
                  htmlFor="signup-phone"
                  className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider"
                >
                  Contact Number <span className="text-[#C08081]">*</span>
                </label>
                <span className="text-[10px] text-[#8C7E72] italic">Profile & shipping updates</span>
              </div>
              <div className="relative">
                <input
                  id="signup-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                />
                <Phone className="w-4 h-4 text-[#736B5E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 3. Email Address Field */}
            <div>
              <label 
                htmlFor="signup-email"
                className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1"
              >
                Email Address <span className="text-[#C08081]">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                />
                <Mail className="w-4 h-4 text-[#736B5E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 4. Password Field */}
            <div>
              <label 
                htmlFor="signup-password"
                className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1"
              >
                Password <span className="text-[#C08081]">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-11 py-2.5 min-h-[44px] bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                />
                <Lock className="w-4 h-4 text-[#736B5E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  id="toggle-signup-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736B5E] hover:text-[#24211E] cursor-pointer p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 5. Confirm Password Field */}
            <div>
              <label 
                htmlFor="signup-confirm-password"
                className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1"
              >
                Confirm Password <span className="text-[#C08081]">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-11 py-2.5 min-h-[44px] bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                />
                <Lock className="w-4 h-4 text-[#736B5E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  id="toggle-signup-confirm-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736B5E] hover:text-[#24211E] cursor-pointer p-1"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Standard Submit Button */}
            <button
              id="signup-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[46px] py-3 px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50 mt-4"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>

            {/* Switch to Sign In */}
            <div className="text-center pt-2">
              <p className="text-xs text-[#736B5E]">
                Already have an account?{' '}
                <button
                  type="button"
                  id="switch-to-signin-link"
                  onClick={() => handleSwitchMode('login')}
                  className="font-semibold text-[#0F4C5C] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </div>
          </form>
        )}

        {/* Optional Guest Exploration */}
        {onContinueAsGuest && (
          <div className="mt-5 pt-3.5 border-t border-[#E8DFD5] text-center">
            <button
              type="button"
              id="continue-as-guest-btn"
              onClick={onContinueAsGuest}
              className="min-h-[40px] px-3 text-xs font-semibold text-[#0F4C5C] hover:text-[#0b3844] hover:underline cursor-pointer uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Explore Store as Guest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
