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
  ArrowLeft,
  KeyRound,
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
  // Mode: 'login' | 'signup' | 'forgot-password'
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot-password'>(initialMode);

  // Forgot Password / OTP Flow State
  const [resetStep, setResetStep] = useState<'request-otp' | 'verify-and-reset'>('request-otp');
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

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

  // Resend OTP countdown cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Mode Switcher
  const handleSwitchMode = (mode: 'login' | 'signup' | 'forgot-password') => {
    setAuthMode(mode);
    setErrorMessage('');
    setSuccessMessage('');
    if (mode === 'forgot-password') {
      setResetStep('request-otp');
      setResetEmail(email.trim());
    }
  };

  // ===========================================================================
  // Step 1: Send OTP to Email for Password Recovery
  // ===========================================================================
  const handleSendResetOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const targetEmail = (resetEmail || email).trim().toLowerCase();
    if (!targetEmail) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch verification code.');
      }

      setResetEmail(targetEmail);
      setResetStep('verify-and-reset');
      setResendCooldown(30);
      setSuccessMessage(data.message || `A 6-digit recovery code has been dispatched to ${targetEmail}.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to send recovery code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===========================================================================
  // Step 2: Verify OTP and Reset Password
  // ===========================================================================
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanOtp = resetOtp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters in length.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('New Password and Confirm Password do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 2A: Verify OTP with backend
      const verifyRes = await fetch('/api/auth/forgot-password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp: cleanOtp })
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Incorrect or expired verification code.');
      }

      // Step 2B: Apply new password to database & Supabase Auth
      const resetRes = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail,
          otp: cleanOtp,
          newPassword,
          confirmPassword: confirmNewPassword
        })
      });
      const resetData = await resetRes.json();
      if (!resetRes.ok) {
        throw new Error(resetData.error || 'Failed to update password.');
      }

      // Success! Prepopulate email in login form and switch mode
      setEmail(resetEmail);
      setPassword('');
      setResetOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
      setAuthMode('login');
      setSuccessMessage('Password reset successfully! Please sign in with your new password.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Password reset failed. Please check the code and try again.');
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Tab Switcher: Sign In vs Create Account vs Password Recovery */}
        {authMode !== 'forgot-password' ? (
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
        ) : (
          <div className="flex items-center justify-between border-b border-[#E8DFD5] mb-6 pb-3">
            <button
              type="button"
              id="back-to-signin-btn"
              onClick={() => handleSwitchMode('login')}
              className="text-xs font-semibold text-[#736B5E] hover:text-[#0F4C5C] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F4C5C]">
              Password Recovery
            </span>
          </div>
        )}

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

            {/* Password Field with Forgot Password Option */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label 
                  htmlFor="signin-password"
                  className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider"
                >
                  Password <span className="text-[#C08081]">*</span>
                </label>
                <button
                  type="button"
                  id="forgot-password-link-btn"
                  onClick={() => handleSwitchMode('forgot-password')}
                  className="text-[11px] font-semibold text-[#0F4C5C] hover:text-[#8C6D37] hover:underline transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
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

        {/* =================================================================== */}
        {/* VIEW 3: FORGOT PASSWORD & OTP RESET FLOW                           */}
        {/* =================================================================== */}
        {authMode === 'forgot-password' && (
          <div className="space-y-4">
            {resetStep === 'request-otp' ? (
              /* Step 1: Prompt for registered email and send OTP */
              <form onSubmit={handleSendResetOtp} className="space-y-4">
                <div className="text-center mb-3">
                  <p className="text-xs text-[#736B5E] leading-relaxed">
                    Enter your registered email address below. We will send a 6-digit one-time password (OTP) directly to your mail to verify your identity and reset your password.
                  </p>
                </div>

                <div>
                  <label 
                    htmlFor="reset-email-input"
                    className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1.5"
                  >
                    Registered Email Address <span className="text-[#C08081]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reset-email-input"
                      type="email"
                      required
                      autoComplete="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                    />
                    <Mail className="w-4 h-4 text-[#736B5E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <button
                  id="send-reset-otp-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[46px] py-3 px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50 mt-4"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending OTP to Mail...</span>
                    </>
                  ) : (
                    <>
                      <span>Send OTP to Mail</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('login')}
                    className="text-xs text-[#736B5E] hover:text-[#0F4C5C] hover:underline cursor-pointer"
                  >
                    Remember your password? Sign In
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Enter OTP, New Password, Confirm New Password */
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
                <div className="bg-[#FAF7F2] border border-[#E8DFD5] p-3 text-center">
                  <p className="text-[11px] text-[#736B5E] mb-1">
                    Enter the 6-digit recovery OTP sent to:
                  </p>
                  <p className="text-xs font-semibold text-[#0F4C5C] break-all">
                    {resetEmail}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setResetStep('request-otp');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-[10px] text-[#8C6D37] hover:underline mt-1 cursor-pointer font-medium"
                  >
                    Change Email Address
                  </button>
                </div>

                {/* 6-Digit OTP */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label 
                      htmlFor="reset-otp-input"
                      className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider"
                    >
                      6-Digit Code (OTP) <span className="text-[#C08081]">*</span>
                    </label>
                    {resendCooldown > 0 ? (
                      <span className="text-[10px] text-[#8A8175]">
                        Resend in {resendCooldown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendResetOtp()}
                        disabled={isSubmitting}
                        className="text-[10px] font-semibold text-[#0F4C5C] hover:underline cursor-pointer"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="reset-otp-input"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      required
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 min-h-[44px] bg-[#FAF9F5] border border-[#D4C7B5] text-center tracking-[0.4em] font-mono font-bold text-sm text-[#0F4C5C] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                    />
                    <KeyRound className="w-4 h-4 text-[#736B5E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label 
                    htmlFor="reset-new-password"
                    className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1"
                  >
                    New Password <span className="text-[#C08081]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reset-new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full pl-10 pr-11 py-2.5 min-h-[44px] bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                    />
                    <Lock className="w-4 h-4 text-[#736B5E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736B5E] hover:text-[#24211E] cursor-pointer p-1"
                      tabIndex={-1}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label 
                    htmlFor="reset-confirm-password"
                    className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1"
                  >
                    Confirm New Password <span className="text-[#C08081]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reset-confirm-password"
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full pl-10 pr-11 py-2.5 min-h-[44px] bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                    />
                    <Lock className="w-4 h-4 text-[#736B5E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736B5E] hover:text-[#24211E] cursor-pointer p-1"
                      tabIndex={-1}
                    >
                      {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="reset-password-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[46px] py-3 px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50 mt-4"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password & Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('login')}
                    className="text-xs text-[#736B5E] hover:text-[#0F4C5C] hover:underline cursor-pointer"
                  >
                    Cancel & Return to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
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
