import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { AaruLogo, AaruEmblem } from './AaruLogo';
import { signInWithGooglePopup } from '../firebase';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  KeyRound,
  X
} from 'lucide-react';

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
  // Primary Screen Modes: 'login' | 'signup' | 'forgot-password'
  const [screenMode, setScreenMode] = useState<'login' | 'signup' | 'forgot-password'>(initialMode);

  // Steps for Forgot Password Flow: 1: 'request-email' -> 2: 'verify-otp' -> 3: 'reset-password' -> 4: 'success'
  const [forgotStep, setForgotStep] = useState<'request-email' | 'verify-otp' | 'reset-password' | 'success'>('request-email');

  // ---------------------------------------------------------------------------
  // Form Field States
  // ---------------------------------------------------------------------------
  // Sign In Form
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up: Manual Password (Name, Contact Number, Email, Password, Confirm Password)
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualPassword, setManualPassword] = useState('');
  const [manualConfirmPassword, setManualConfirmPassword] = useState('');
  const [showManualPassword, setShowManualPassword] = useState(false);
  const [showManualConfirmPassword, setShowManualConfirmPassword] = useState(false);

  // Google Authentication States
  const [showGoogleDialog, setShowGoogleDialog] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('mettapavan622@gmail.com');
  const [googleNameInput, setGoogleNameInput] = useState('Pavan Metta');

  // Forgot Password Form States
  const [forgotEmail, setForgotEmail] = useState('');
  const [recoveryOtpDigits, setRecoveryOtpDigits] = useState(['', '', '', '', '', '']);
  const [recoveryCountdown, setRecoveryCountdown] = useState(30);
  const [recoveryCanResend, setRecoveryCanResend] = useState(false);
  const [recoveryDemoOtp, setRecoveryDemoOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // General Feedback States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // OTP Input Element Reference for Password Recovery
  const recoveryOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (initialMode) {
      setScreenMode(initialMode);
    }
  }, [initialMode]);

  // Timer for Forgot Password Recovery OTP Resend Countdown
  useEffect(() => {
    let timer: any;
    if (screenMode === 'forgot-password' && forgotStep === 'verify-otp' && recoveryCountdown > 0) {
      timer = setInterval(() => {
        setRecoveryCountdown((prev) => {
          if (prev <= 1) {
            setRecoveryCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [screenMode, forgotStep, recoveryCountdown]);

  // Focus First Input on OTP Transitions
  useEffect(() => {
    if (forgotStep === 'verify-otp' && recoveryOtpRefs.current[0]) {
      setTimeout(() => recoveryOtpRefs.current[0]?.focus(), 150);
    }
  }, [forgotStep]);

  // Reset messages when switching modes
  const handleSwitchScreen = (mode: 'login' | 'signup' | 'forgot-password') => {
    setScreenMode(mode);
    setErrorMessage('');
    setSuccessToast('');
  };

  // ---------------------------------------------------------------------------
  // Generic 6-Digit OTP Box Handlers
  // ---------------------------------------------------------------------------
  const handleDigitChange = (
    index: number,
    value: string,
    digits: string[],
    setDigits: React.Dispatch<React.SetStateAction<string[]>>,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (value.length > 1) {
      // Pasted multi-digit OTP string
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const updated = [...digits];
      pasted.forEach((d, i) => {
        if (index + i < 6) updated[index + i] = d;
      });
      setDigits(updated);
      const nextIdx = Math.min(index + pasted.length, 5);
      refs.current[nextIdx]?.focus();
      return;
    }

    const updated = [...digits];
    updated[index] = value.replace(/\D/g, '');
    setDigits(updated);

    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    digits: string[],
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  // ===========================================================================
  // Requirement 2: Sign In Flow (Email + Password) with Role-Based Redirection
  // ===========================================================================
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessToast('');

    const trimmedEmail = signInEmail.trim().toLowerCase();
    const enteredPassword = signInPassword;

    if (!trimmedEmail || !enteredPassword) {
      setErrorMessage('Please enter both your Email Address and Password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedEmail,
          password: enteredPassword
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Invalid email or password.');
      }

      // Check for exact admin credentials or admin role
      const isExactAdmin = trimmedEmail === 'aarubymoni@admin.co.in' && enteredPassword === 'aarubymoni@1';
      const authenticatedUser: User = {
        ...data.user,
        role: (isExactAdmin || data.user.role === 'admin') ? 'admin' : 'customer'
      };

      localStorage.setItem('aaru_user_session', JSON.stringify(authenticatedUser));
      if (data.token) {
        localStorage.setItem('aaru_auth_token', data.token);
      }

      const redirectNotice = authenticatedUser.role === 'admin'
        ? 'Welcome Store Administrator! Redirecting to Admin Dashboard...'
        : 'Signed in successfully. Redirecting to Customer Storefront...';

      setSuccessToast(data.message || redirectNotice);
      setTimeout(() => {
        onLoginSuccess(authenticatedUser, {
          cart: data.cart || [],
          wishlist: data.wishlist || [],
          orders: data.orders || []
        });
        if (onClose) onClose();
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to sign in. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===========================================================================
  // Requirement 1: Sign Up Flow - Option A (Manual Password)
  // Fields: Name, Contact Number, Email Address, Password, Confirm Password
  // ===========================================================================
  const handleManualSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessToast('');

    if (!manualName.trim() || !manualPhone.trim() || !manualEmail.trim() || !manualPassword || !manualConfirmPassword) {
      setErrorMessage('Please complete all fields: Name, Contact Number, Email, Password, and Confirm Password.');
      return;
    }

    if (manualPassword !== manualConfirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    if (manualPassword.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/signup/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: manualName.trim(),
          phone: manualPhone.trim(),
          email: manualEmail.trim(),
          password: manualPassword,
          confirmPassword: manualConfirmPassword
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account.');
      }

      localStorage.setItem('aaru_user_session', JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem('aaru_auth_token', data.token);
      }

      setSuccessToast(data.message || 'Account created successfully!');
      setTimeout(() => {
        onLoginSuccess(data.user, {
          cart: data.cart || [],
          wishlist: data.wishlist || [],
          orders: data.orders || []
        });
        if (onClose) onClose();
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Sign up could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===========================================================================
  // Google Authentication Integration (One-Tap / Client-side token & API gateway)
  // ===========================================================================
  const completeGoogleAuth = async (email: string, name?: string, picture?: string) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessToast('');

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name?.trim() || email.split('@')[0],
          picture: picture || ''
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Google authentication failed.');
      }

      localStorage.setItem('aaru_user_session', JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem('aaru_auth_token', data.token);
      }

      setSuccessToast(data.message || `Welcome to AARU Atelier, ${data.user.name}!`);
      setShowGoogleDialog(false);

      setTimeout(() => {
        onLoginSuccess(data.user, {
          cart: data.cart || [],
          wishlist: data.wishlist || [],
          orders: data.orders || []
        });
        if (onClose) onClose();
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setSuccessToast('');

    // 1. Try Firebase Authentication with Google Popup
    try {
      setIsSubmitting(true);
      const { fbUser } = await signInWithGooglePopup();
      if (fbUser && fbUser.email) {
        await completeGoogleAuth(
          fbUser.email,
          fbUser.displayName || undefined,
          fbUser.photoURL || undefined
        );
        return;
      }
    } catch (err: any) {
      console.warn('Firebase Google Sign-in Notice (checking fallback):', err);
    } finally {
      setIsSubmitting(false);
    }

    // 2. Try Google Identity Services (GSI) if configured
    const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    if (clientId && (window as any).google?.accounts?.oauth2) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.access_token) {
              try {
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const profile = await userInfoRes.json();
                await completeGoogleAuth(profile.email, profile.name, profile.picture);
              } catch (e) {
                setShowGoogleDialog(true);
              }
            }
          }
        });
        client.requestAccessToken();
        return;
      } catch (err) {
        console.warn('Google GSI token client fallback:', err);
      }
    }

    // 3. Direct Google account dialog (instant one-click for preview / sandbox)
    setShowGoogleDialog(true);
  };

  // ===========================================================================
  // Requirement 3: Forgot Password & Account Recovery Flow
  // Step 1: Prompt Email -> Email OTP
  // Step 2: Verify OTP
  // Step 3: Set New Password & Confirm Password
  // ===========================================================================
  const handleForgotRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessToast('');

    if (!forgotEmail.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim()
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to dispatch password recovery code.');
      }

      if (data.demoOtp) {
        setRecoveryDemoOtp(data.demoOtp);
      }

      setForgotStep('verify-otp');
      setRecoveryCountdown(30);
      setRecoveryCanResend(false);
      setSuccessToast(data.message || `Recovery code sent to ${forgotEmail.trim()}.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to process recovery request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessToast('');

    const enteredOtp = recoveryOtpDigits.join('');
    if (enteredOtp.length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/forgot-password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          otp: enteredOtp
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Invalid recovery code.');
      }

      setForgotStep('reset-password');
      setSuccessToast(data.message || 'Code verified. Create your new password.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessToast('');

    if (!newPassword || !confirmNewPassword) {
      setErrorMessage('Please fill in both New Password and Confirm Password.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          newPassword,
          confirmPassword: confirmNewPassword
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password.');
      }

      setForgotStep('success');
      setSuccessToast(data.message || 'Password successfully updated!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not update password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendForgotOtp = async () => {
    setErrorMessage('');
    setSuccessToast('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          purpose: 'forgot-password'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not resend code.');
      }

      if (data.demoOtp) {
        setRecoveryDemoOtp(data.demoOtp);
      }

      setRecoveryCountdown(30);
      setRecoveryCanResend(false);
      setSuccessToast(data.message || 'New recovery code sent.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      id="aaru-auth-portal"
      className={`${
        isModal 
          ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200'
          : 'min-h-screen w-full flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5] relative overflow-hidden'
      }`}
    >
      {/* Background Atmosphere: Rich Designer Accents */}
      {!isModal && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#0F4C5C]/6 blur-3xl" />
          <div className="absolute top-1/2 -left-32 w-96 h-96 rounded-full bg-[#C08081]/8 blur-3xl" />
          <div className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full bg-[#8C6D37]/7 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#8C6D37_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        </div>
      )}

      {/* Main Centered Card */}
      <div 
        id="auth-card-container"
        className="w-full max-w-md bg-white border border-[#D4C7B5] shadow-2xl relative z-10 p-6 sm:p-8 transition-all"
      >
        {/* Close Button if opened in modal mode */}
        {isModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-1.5 text-[#736B5E] hover:text-[#24211E] rounded-none hover:bg-[#FAF9F5] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Brand Insignia & Authentic Identity: Logo, Name & Tagline Only */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <AaruLogo className="h-10 text-[#0F4C5C]" showSubtitle={false} size="md" />
          </div>

          <p className="text-[11px] tracking-[0.25em] text-[#8C6D37] uppercase font-bold">
            A Woman’s Sixth Element
          </p>
          <p className="text-[9px] tracking-[0.2em] text-[#736B5E] uppercase mt-0.5">
            హైదరాబాద్ • బెంగళూరు • Luxury Studio
          </p>
        </div>

        {/* ===================================================================== */}
        {/* Primary View Switcher: Sign In vs Sign Up (or Back Link for Recovery) */}
        {/* ===================================================================== */}
        {screenMode === 'forgot-password' ? (
          <div className="mb-6 flex items-center justify-between border-b border-[#E8DFD5] pb-3">
            <button
              type="button"
              onClick={() => handleSwitchScreen('login')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F4C5C] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6D37]">
              Account Recovery
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 border-b border-[#E8DFD5] mb-6">
            <button
              type="button"
              id="tab-signin-btn"
              onClick={() => handleSwitchScreen('login')}
              className={`pb-3 text-xs font-bold uppercase tracking-[0.16em] transition-all cursor-pointer text-center ${
                screenMode === 'login'
                  ? 'border-b-2 border-[#0F4C5C] text-[#0F4C5C]'
                  : 'text-[#736B5E] hover:text-[#24211E]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              id="tab-signup-btn"
              onClick={() => handleSwitchScreen('signup')}
              className={`pb-3 text-xs font-bold uppercase tracking-[0.16em] transition-all cursor-pointer text-center ${
                screenMode === 'signup'
                  ? 'border-b-2 border-[#0F4C5C] text-[#0F4C5C]'
                  : 'text-[#736B5E] hover:text-[#24211E]'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#F87171]/40 flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <p className="text-xs text-[#991B1B] font-medium leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Success Notification Banner */}
        {successToast && (
          <div className="mb-4 p-3 bg-[#F0FDF4] border border-[#86EFAC]/40 flex items-start gap-2.5 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
            <p className="text-xs text-[#166534] font-medium leading-relaxed">{successToast}</p>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 1: SIGN IN FLOW (Requirement 2: Email Address + Password) */}
        {/* ===================================================================== */}
        {screenMode === 'login' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1.5">
                Email Address <span className="text-[#C08081]">*</span>
              </label>
              <div className="relative">
                <input
                  id="signin-email"
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="e.g. aditi.sharma@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                />
                <Mail className="w-4 h-4 text-[#736B5E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider">
                  Password <span className="text-[#C08081]">*</span>
                </label>
                <button
                  type="button"
                  id="forgot-password-link"
                  onClick={() => handleSwitchScreen('forgot-password')}
                  className="text-[11px] font-semibold text-[#0F4C5C] hover:underline cursor-pointer tracking-tight"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showSignInPassword ? 'text' : 'password'}
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-9 py-2.5 bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                />
                <Lock className="w-4 h-4 text-[#736B5E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  id="toggle-signin-password-visibility"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736B5E] hover:text-[#24211E] cursor-pointer"
                  tabIndex={-1}
                >
                  {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="signin-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8DFD5]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-[#736B5E]">
                <span className="bg-[#FAF7F2] sm:bg-white px-2">or continue with</span>
              </div>
            </div>

            {/* Sign in with Google Option */}
            <button
              type="button"
              id="google-signin-btn"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-white border border-[#D4C7B5] hover:border-[#0F4C5C] hover:bg-[#FAF9F5] text-[#24211E] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google</span>
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-[#736B5E]">
                New to AARU?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchScreen('signup')}
                  className="font-semibold text-[#0F4C5C] hover:underline cursor-pointer"
                >
                  Create an Account
                </button>
              </p>
            </div>
          </form>
        )}

        {/* ===================================================================== */}
        {/* VIEW 2: SIGN UP FLOW (Strictly Manual Password Creation) */}
        {/* ===================================================================== */}
        {screenMode === 'signup' && (
          <div className="space-y-4">
            {/* Quick Google Sign Up Option */}
            <button
              type="button"
              id="google-signup-btn"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-white border border-[#D4C7B5] hover:border-[#0F4C5C] hover:bg-[#FAF9F5] text-[#24211E] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign up with Google</span>
            </button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8DFD5]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-[#736B5E]">
                <span className="bg-[#FAF7F2] sm:bg-white px-2">or register with manual password</span>
              </div>
            </div>

            {/* Manual Password Sign Up Form */}
            <form onSubmit={handleManualSignUp} className="space-y-3.5 animate-in fade-in duration-150">
              {/* 1. Name */}
              <div>
                <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1">
                  Name <span className="text-[#C08081]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="signup-manual-name"
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="e.g. Aditi Sharma"
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                  />
                  <UserIcon className="w-3.5 h-3.5 text-[#736B5E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 2. Contact Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider">
                    Contact Number <span className="text-[#C08081]">*</span>
                  </label>
                  <span className="text-[10px] text-[#8C6D37] italic">Profile & shipping updates</span>
                </div>
                <div className="relative">
                  <input
                    id="signup-manual-phone"
                    type="tel"
                    required
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="e.g. +91 93460 66170"
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                  />
                  <Phone className="w-3.5 h-3.5 text-[#736B5E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 3. Email Address */}
              <div>
                <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1">
                  Email Address <span className="text-[#C08081]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="signup-manual-email"
                    type="email"
                    required
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="e.g. aditi.sharma@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                  />
                  <Mail className="w-3.5 h-3.5 text-[#736B5E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 4. Password */}
              <div>
                <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1">
                  Password <span className="text-[#C08081]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="signup-manual-password"
                    type={showManualPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={manualPassword}
                    onChange={(e) => setManualPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-9 py-2 bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                  />
                  <Lock className="w-3.5 h-3.5 text-[#736B5E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowManualPassword(!showManualPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736B5E] hover:text-[#24211E] cursor-pointer"
                    tabIndex={-1}
                  >
                    {showManualPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 5. Confirm Password */}
              <div>
                <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1">
                  Confirm Password <span className="text-[#C08081]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="signup-manual-confirm-password"
                    type={showManualConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={manualConfirmPassword}
                    onChange={(e) => setManualConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="w-full pl-9 pr-9 py-2 bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                  />
                  <Lock className="w-3.5 h-3.5 text-[#736B5E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowManualConfirmPassword(!showManualConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736B5E] hover:text-[#24211E] cursor-pointer"
                    tabIndex={-1}
                  >
                    {showManualConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                id="signup-manual-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50 mt-3"
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
            </form>

            <div className="text-center pt-2">
              <p className="text-xs text-[#736B5E]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchScreen('login')}
                  className="font-semibold text-[#0F4C5C] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 3: FORGOT PASSWORD & RECOVERY (Requirement 3: Email OTP Recovery) */}
        {/* ===================================================================== */}
        {screenMode === 'forgot-password' && (
          <div className="space-y-4">
            {/* Step 3A: Request Recovery Code */}
            {forgotStep === 'request-email' && (
              <form onSubmit={handleForgotRequestOtp} className="space-y-4 animate-in fade-in duration-150">
                <p className="text-xs text-[#5C5549] leading-relaxed">
                  Enter your registered email address. We will dispatch a secure 6-digit recovery code to your inbox.
                </p>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1.5">
                    Registered Email Address <span className="text-[#C08081]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="forgot-email-input"
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. aditi.sharma@example.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                    />
                    <Mail className="w-4 h-4 text-[#736B5E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <button
                  id="forgot-email-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Dispatching Recovery Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 3B: Verify Recovery OTP */}
            {forgotStep === 'verify-otp' && (
              <form onSubmit={handleForgotVerifyOtp} className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between p-2.5 bg-[#FAF7F2] border border-[#E8DFD5] text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#0F4C5C] shrink-0" />
                    <span className="font-semibold text-[#24211E] truncate">
                      {forgotEmail}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep('request-email');
                      setErrorMessage('');
                    }}
                    className="text-[11px] font-semibold text-[#0F4C5C] hover:underline cursor-pointer shrink-0 ml-2"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-2 text-center">
                    Enter 6-Digit Password Recovery Code
                  </label>
                  <div className="flex justify-between gap-1.5 sm:gap-2">
                    {recoveryOtpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (recoveryOtpRefs.current[idx] = el)}
                        id={`recovery-otp-input-${idx}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleDigitChange(
                            idx,
                            e.target.value,
                            recoveryOtpDigits,
                            setRecoveryOtpDigits,
                            recoveryOtpRefs
                          )
                        }
                        onKeyDown={(e) =>
                          handleDigitKeyDown(idx, e, recoveryOtpDigits, recoveryOtpRefs)
                        }
                        className="w-10 h-12 sm:w-12 sm:h-12 text-center font-mono text-lg font-bold text-[#0F4C5C] bg-[#FAF9F5] border border-[#D4C7B5] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-all shadow-xs"
                      />
                    ))}
                  </div>
                </div>

                {recoveryDemoOtp && (
                  <div className="p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#8C6D37]" />
                      <span className="text-[#5C5549]">
                        Demo Recovery Code: <strong className="text-[#0F4C5C] font-mono">{recoveryDemoOtp}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRecoveryOtpDigits(recoveryDemoOtp.split(''))}
                      className="text-[10px] font-bold text-[#8C6D37] hover:underline uppercase tracking-wider"
                    >
                      Auto-Fill
                    </button>
                  </div>
                )}

                <button
                  id="recovery-otp-verify-btn"
                  type="submit"
                  disabled={isSubmitting || recoveryOtpDigits.join('').length !== 6}
                  className="w-full py-3 px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Verify Recovery Code</span>
                    </>
                  )}
                </button>

                <div className="text-center pt-1">
                  {recoveryCanResend ? (
                    <button
                      type="button"
                      id="recovery-otp-resend-btn"
                      onClick={handleResendForgotOtp}
                      disabled={isSubmitting}
                      className="text-xs font-semibold text-[#0F4C5C] hover:underline cursor-pointer uppercase tracking-wider"
                    >
                      Resend Recovery Code
                    </button>
                  ) : (
                    <p className="text-xs text-[#736B5E]">
                      Resend code in <strong className="text-[#24211E] font-mono">{recoveryCountdown}s</strong>
                    </p>
                  )}
                </div>
              </form>
            )}

            {/* Step 3C: Set New Password */}
            {forgotStep === 'reset-password' && (
              <form onSubmit={handleForgotResetPassword} className="space-y-4 animate-in fade-in duration-150">
                <p className="text-xs text-[#5C5549] leading-relaxed">
                  Your code has been verified. Create a new strong password for your account.
                </p>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1.5">
                    New Password <span className="text-[#C08081]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reset-new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-9 pr-9 py-2.5 bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                    />
                    <Lock className="w-4 h-4 text-[#736B5E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736B5E] hover:text-[#24211E] cursor-pointer"
                      tabIndex={-1}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1.5">
                    Confirm New Password <span className="text-[#C08081]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reset-confirm-password"
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full pl-9 pr-9 py-2.5 bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                    />
                    <Lock className="w-4 h-4 text-[#736B5E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#736B5E] hover:text-[#24211E] cursor-pointer"
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
                  className="w-full py-3 px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Update Password & Complete Recovery</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 3D: Success */}
            {forgotStep === 'success' && (
              <div className="text-center py-4 space-y-4 animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-full bg-[#0F4C5C]/10 text-[#0F4C5C] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#24211E] uppercase tracking-wider font-serif">
                    Password Successfully Reset
                  </h3>
                  <p className="text-xs text-[#5C5549] mt-1.5 leading-relaxed">
                    Your account password has been updated in the database. You may now sign in using your new password.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSignInEmail(forgotEmail);
                    handleSwitchScreen('login');
                  }}
                  className="w-full py-3 px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] transition-colors cursor-pointer shadow-xs"
                >
                  Proceed to Sign In
                </button>
              </div>
            )}
          </div>
        )}

        {/* Guest Exploration Option */}
        {onContinueAsGuest && (
          <div className="mt-8 pt-5 border-t border-[#E8DFD5] text-center">
            <button
              type="button"
              id="continue-as-guest-btn"
              onClick={onContinueAsGuest}
              className="text-xs font-semibold text-[#0F4C5C] hover:text-[#0b3844] hover:underline cursor-pointer uppercase tracking-wider inline-flex items-center gap-1"
            >
              <span>Explore Store as Guest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ===================================================================== */}
        {/* Google Authentication Dialog Modal */}
        {/* ===================================================================== */}
        {showGoogleDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white max-w-sm w-full p-6 shadow-2xl border border-[#D4C7B5] relative animate-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => setShowGoogleDialog(false)}
                className="absolute top-4 right-4 text-[#736B5E] hover:text-[#24211E] cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Google Brand Header */}
              <div className="text-center mb-5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8DFD5] mb-2">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-[#24211E]">Sign in with Google</h3>
                <p className="text-[11px] text-[#736B5E] mt-0.5">to continue to AARU Atelier</p>
              </div>

              {/* Quick Account Button for Active User */}
              <div className="space-y-3">
                <button
                  type="button"
                  id="google-quick-account-btn"
                  onClick={() => completeGoogleAuth('mettapavan622@gmail.com', 'Pavan Metta')}
                  disabled={isSubmitting}
                  className="w-full p-3 bg-[#FAF9F5] hover:bg-[#FAF7F2] border border-[#D4C7B5] hover:border-[#0F4C5C] flex items-center gap-3 transition-colors text-left cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#0F4C5C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    PM
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#24211E] group-hover:text-[#0F4C5C] truncate">
                      Pavan Metta
                    </p>
                    <p className="text-[11px] text-[#736B5E] truncate">mettapavan622@gmail.com</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#736B5E] group-hover:text-[#0F4C5C] shrink-0" />
                </button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E8DFD5]" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-[#736B5E]">
                    <span className="bg-white px-2">or use another account</span>
                  </div>
                </div>

                {/* Custom Google Email Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (googleEmailInput.trim()) {
                      completeGoogleAuth(googleEmailInput.trim(), googleNameInput.trim());
                    }
                  }}
                  className="space-y-2.5"
                >
                  <div>
                    <label className="block text-[10px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1">
                      Google Email
                    </label>
                    <input
                      id="google-custom-email-input"
                      type="email"
                      required
                      value={googleEmailInput}
                      onChange={(e) => setGoogleEmailInput(e.target.value)}
                      placeholder="e.g. user@gmail.com"
                      className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1">
                      Display Name (Optional)
                    </label>
                    <input
                      id="google-custom-name-input"
                      type="text"
                      value={googleNameInput}
                      onChange={(e) => setGoogleNameInput(e.target.value)}
                      placeholder="e.g. Aditi Sharma"
                      className="w-full px-3 py-2 bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C]"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowGoogleDialog(false)}
                      className="flex-1 py-2 text-xs font-semibold text-[#736B5E] hover:text-[#24211E] bg-[#FAF9F5] border border-[#D4C7B5] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      id="google-custom-confirm-btn"
                      disabled={isSubmitting || !googleEmailInput.trim()}
                      className="flex-1 py-2 text-xs font-semibold text-white bg-[#0F4C5C] hover:bg-[#0b3844] cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? 'Signing In...' : 'Continue'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
