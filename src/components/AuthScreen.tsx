import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { AaruLogo, AaruEmblem } from './AaruLogo';
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
  
  // Sign Up Tab Toggle: exactly TWO options: 'manual' (Option A) vs 'otp' (Option B)
  const [signupTab, setSignupTab] = useState<'manual' | 'otp'>('manual');
  
  // Step for Option B (Email OTP): 'form' -> 'otp'
  const [signupOtpStep, setSignupOtpStep] = useState<'form' | 'otp'>('form');

  // Steps for Forgot Password Flow: 1: 'request-email' -> 2: 'verify-otp' -> 3: 'reset-password' -> 4: 'success'
  const [forgotStep, setForgotStep] = useState<'request-email' | 'verify-otp' | 'reset-password' | 'success'>('request-email');

  // ---------------------------------------------------------------------------
  // Form Field States
  // ---------------------------------------------------------------------------
  // Sign In Form
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up Option A: Manual Password (Name, Contact Number, Email, Password, Confirm Password)
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualPassword, setManualPassword] = useState('');
  const [manualConfirmPassword, setManualConfirmPassword] = useState('');
  const [showManualPassword, setShowManualPassword] = useState(false);
  const [showManualConfirmPassword, setShowManualConfirmPassword] = useState(false);

  // Sign Up Option B: Email OTP (Name, Contact Number, Email)
  const [otpSignupName, setOtpSignupName] = useState('');
  const [otpSignupPhone, setOtpSignupPhone] = useState('');
  const [otpSignupEmail, setOtpSignupEmail] = useState('');
  const [signupOtpDigits, setSignupOtpDigits] = useState(['', '', '', '', '', '']);
  const [signupCountdown, setSignupCountdown] = useState(30);
  const [signupCanResend, setSignupCanResend] = useState(false);
  const [signupDemoOtp, setSignupDemoOtp] = useState<string>('');

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

  // OTP Input Element References
  const signupOtpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const recoveryOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (initialMode) {
      setScreenMode(initialMode);
    }
  }, [initialMode]);

  // Timer for Signup OTP Resend Countdown
  useEffect(() => {
    let timer: any;
    if (screenMode === 'signup' && signupOtpStep === 'otp' && signupCountdown > 0) {
      timer = setInterval(() => {
        setSignupCountdown((prev) => {
          if (prev <= 1) {
            setSignupCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [screenMode, signupOtpStep, signupCountdown]);

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
    if (signupOtpStep === 'otp' && signupOtpRefs.current[0]) {
      setTimeout(() => signupOtpRefs.current[0]?.focus(), 150);
    }
  }, [signupOtpStep]);

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
  // Requirement 1: Sign Up Flow - Option B (Email OTP)
  // Fields: Name, Contact Number, Email Address -> Email OTP -> Verify -> Account Created
  // ===========================================================================
  const handleSendSignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessToast('');

    if (!otpSignupName.trim() || !otpSignupPhone.trim() || !otpSignupEmail.trim()) {
      setErrorMessage('Please provide Name, Contact Number, and Email Address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/signup/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: otpSignupName.trim(),
          phone: otpSignupPhone.trim(),
          email: otpSignupEmail.trim()
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to dispatch verification code.');
      }

      if (data.demoOtp) {
        setSignupDemoOtp(data.demoOtp);
      }

      setSignupOtpStep('otp');
      setSignupCountdown(30);
      setSignupCanResend(false);
      setSuccessToast(data.message || `Verification code sent to ${otpSignupEmail.trim()}.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to send verification code. Please check your email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifySignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessToast('');

    const enteredOtp = signupOtpDigits.join('');
    if (enteredOtp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/signup/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: otpSignupEmail.trim(),
          otp: enteredOtp
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed. Incorrect code.');
      }

      localStorage.setItem('aaru_user_session', JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem('aaru_auth_token', data.token);
      }

      setSuccessToast(data.message || 'Email verified! Account created.');
      setTimeout(() => {
        onLoginSuccess(data.user, {
          cart: data.cart || [],
          wishlist: data.wishlist || [],
          orders: data.orders || []
        });
        if (onClose) onClose();
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to verify code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendSignupOtp = async () => {
    setErrorMessage('');
    setSuccessToast('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: otpSignupEmail.trim(),
          purpose: 'signup'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not resend code.');
      }

      if (data.demoOtp) {
        setSignupDemoOtp(data.demoOtp);
      }

      setSignupCountdown(30);
      setSignupCanResend(false);
      setSuccessToast(data.message || 'New verification code sent.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend code.');
    } finally {
      setIsSubmitting(false);
    }
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
        {/* VIEW 2: SIGN UP FLOW (Requirement 1: Exactly TWO Options) */}
        {/* ===================================================================== */}
        {screenMode === 'signup' && (
          <div className="space-y-4">
            {/* Toggle / Tabs for Exactly Two Options */}
            <div className="p-1 bg-[#FAF7F2] border border-[#E8DFD5] flex gap-1 rounded-none">
              <button
                type="button"
                id="signup-tab-manual-btn"
                onClick={() => {
                  setSignupTab('manual');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 px-2 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center ${
                  signupTab === 'manual'
                    ? 'bg-white text-[#0F4C5C] shadow-xs border border-[#D4C7B5]'
                    : 'text-[#736B5E] hover:text-[#24211E]'
                }`}
              >
                Option A: Manual Password
              </button>
              <button
                type="button"
                id="signup-tab-otp-btn"
                onClick={() => {
                  setSignupTab('otp');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2 px-2 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center ${
                  signupTab === 'otp'
                    ? 'bg-white text-[#0F4C5C] shadow-xs border border-[#D4C7B5]'
                    : 'text-[#736B5E] hover:text-[#24211E]'
                }`}
              >
                Option B: Email OTP
              </button>
            </div>

            {/* --------------------------------------------------------------- */}
            {/* OPTION A: Manual Password Sign Up */}
            {/* Form containing exactly: Name, Contact Number, Email Address, Password, Confirm Password */}
            {/* --------------------------------------------------------------- */}
            {signupTab === 'manual' && (
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
                    <span className="text-[10px] text-[#8C6D37] italic">Profile & shipping updates only</span>
                  </div>
                  <div className="relative">
                    <input
                      id="signup-manual-phone"
                      type="tel"
                      required
                      value={manualPhone}
                      onChange={(e) => setManualPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
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
            )}

            {/* --------------------------------------------------------------- */}
            {/* OPTION B: Email OTP */}
            {/* Form asking ONLY for Name, Contact Number, Email Address -> Email OTP */}
            {/* --------------------------------------------------------------- */}
            {signupTab === 'otp' && (
              <>
                {signupOtpStep === 'form' ? (
                  <form onSubmit={handleSendSignupOtp} className="space-y-3.5 animate-in fade-in duration-150">
                    {/* 1. Name */}
                    <div>
                      <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1">
                        Name <span className="text-[#C08081]">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="signup-otp-name"
                          type="text"
                          required
                          value={otpSignupName}
                          onChange={(e) => setOtpSignupName(e.target.value)}
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
                        <span className="text-[10px] text-[#8C6D37] italic">Order shipping data only</span>
                      </div>
                      <div className="relative">
                        <input
                          id="signup-otp-phone"
                          type="tel"
                          required
                          value={otpSignupPhone}
                          onChange={(e) => setOtpSignupPhone(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
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
                          id="signup-otp-email"
                          type="email"
                          required
                          value={otpSignupEmail}
                          onChange={(e) => setOtpSignupEmail(e.target.value)}
                          placeholder="e.g. aditi.sharma@example.com"
                          className="w-full pl-9 pr-3 py-2 bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                        />
                        <Mail className="w-3.5 h-3.5 text-[#736B5E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      <p className="text-[10px] text-[#736B5E] mt-1.5 leading-relaxed">
                        We will dispatch a secure 6-digit one-time code to your email address.
                      </p>
                    </div>

                    <button
                      id="signup-otp-send-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50 mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Dispatching Verification Code...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Verification Code</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Step 2 of Option B: Enter 6-digit OTP */
                  <form onSubmit={handleVerifySignupOtp} className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between p-2.5 bg-[#FAF7F2] border border-[#E8DFD5] text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-[#0F4C5C] shrink-0" />
                        <span className="font-semibold text-[#24211E] truncate">
                          {otpSignupEmail}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSignupOtpStep('form');
                          setErrorMessage('');
                        }}
                        className="text-[11px] font-semibold text-[#0F4C5C] hover:underline cursor-pointer shrink-0 ml-2"
                      >
                        Edit Details
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-2 text-center">
                        Enter 6-Digit Verification Code
                      </label>
                      <div className="flex justify-between gap-1.5 sm:gap-2">
                        {signupOtpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => (signupOtpRefs.current[idx] = el)}
                            id={`signup-otp-input-${idx}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) =>
                              handleDigitChange(
                                idx,
                                e.target.value,
                                signupOtpDigits,
                                setSignupOtpDigits,
                                signupOtpRefs
                              )
                            }
                            onKeyDown={(e) =>
                              handleDigitKeyDown(idx, e, signupOtpDigits, signupOtpRefs)
                            }
                            className="w-10 h-12 sm:w-12 sm:h-12 text-center font-mono text-lg font-bold text-[#0F4C5C] bg-[#FAF9F5] border border-[#D4C7B5] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-all shadow-xs"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Simulated Verification OTP Helper Indicator for Rapid Sandbox Evaluation */}
                    {signupDemoOtp && (
                      <div className="p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#8C6D37]" />
                          <span className="text-[#5C5549]">
                            Demo Sandbox Code: <strong className="text-[#0F4C5C] font-mono">{signupDemoOtp}</strong>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSignupOtpDigits(signupDemoOtp.split(''))}
                          className="text-[10px] font-bold text-[#8C6D37] hover:underline uppercase tracking-wider"
                        >
                          Auto-Fill
                        </button>
                      </div>
                    )}

                    <button
                      id="signup-otp-verify-btn"
                      type="submit"
                      disabled={isSubmitting || signupOtpDigits.join('').length !== 6}
                      className="w-full py-3 px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying Code...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify & Create Account</span>
                        </>
                      )}
                    </button>

                    <div className="text-center pt-1">
                      {signupCanResend ? (
                        <button
                          type="button"
                          id="signup-otp-resend-btn"
                          onClick={handleResendSignupOtp}
                          disabled={isSubmitting}
                          className="text-xs font-semibold text-[#0F4C5C] hover:underline cursor-pointer uppercase tracking-wider"
                        >
                          Resend Verification Code
                        </button>
                      ) : (
                        <p className="text-xs text-[#736B5E]">
                          Resend code in <strong className="text-[#24211E] font-mono">{signupCountdown}s</strong>
                        </p>
                      )}
                    </div>
                  </form>
                )}
              </>
            )}

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
      </div>
    </div>
  );
};
