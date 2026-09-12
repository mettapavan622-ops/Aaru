import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { AaruLogo, AaruEmblem, AaruTeluguLogo, AaruEnglishLogo } from './AaruLogo';
import { 
  Phone, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  UserCheck, 
  X,
  ChevronDown
} from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
  onContinueAsGuest?: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

const COUNTRY_CODES = [
  { code: '+1', country: 'United States & Canada', flag: '🇺🇸' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  onContinueAsGuest,
  isModal = false,
  onClose
}) => {
  // Mode: 'login' | 'signup'
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [logoDisplayMode, setLogoDisplayMode] = useState<'dual' | 'telugu' | 'english'>('dual');

  // Mobile Auth State
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpStep, setOtpStep] = useState<'phone' | 'otp'>('phone');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [demoOtpCode, setDemoOtpCode] = useState<string>('');
  
  // Loading & Error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Google OAuth Interactive Modal Simulation
  const [showGoogleConsentModal, setShowGoogleConsentModal] = useState(false);
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState('anantharao2018@gmail.com');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: any;
    if (otpStep === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpStep, countdown]);

  // Focus first OTP input when step changes to 'otp'
  useEffect(() => {
    if (otpStep === 'otp' && otpInputsRef.current[0]) {
      setTimeout(() => otpInputsRef.current[0]?.focus(), 150);
    }
  }, [otpStep]);

  // =========================================================================
  // Google OAuth Flow Implementation
  // =========================================================================
  const handleInitiateGoogleAuth = () => {
    setErrorMessage('');
    // Open Google OAuth Account Selector / Consent Screen
    setShowGoogleConsentModal(true);
  };

  const handleConfirmGoogleAuth = async (emailToUse: string, nameToUse?: string) => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    try {
      const targetEmail = emailToUse || selectedGoogleAccount;
      const targetName = nameToUse || (targetEmail.includes('anantha') ? 'Anantha Rao' : targetEmail.split('@')[0]);

      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          name: targetName,
          credential: `google-oauth2-${Date.now()}`
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Google authentication failed.');
      }

      // Establish persistent session in localStorage
      localStorage.setItem('aaru_user_session', JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem('aaru_auth_token', data.token);
      }

      setSuccessToast(data.message || 'Authenticated with Google successfully.');
      setShowGoogleConsentModal(false);

      setTimeout(() => {
        onLoginSuccess(data.user);
        if (onClose) onClose();
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google authorization could not be completed.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // =========================================================================
  // Mobile Number (SMS OTP) Flow
  // =========================================================================
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    setSuccessToast('');

    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (!digitsOnly || digitsOnly.length < 7) {
      setErrorMessage('Please enter a valid mobile number (minimum 7 digits).');
      return;
    }

    if (authMode === 'signup' && !fullName.trim()) {
      setErrorMessage('Please enter your full name for registration.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/mobile/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          countryCode,
          isSignUp: authMode === 'signup'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to dispatch verification code.');
      }

      if (data.demoOtp) {
        setDemoOtpCode(data.demoOtp);
      }

      setOtpStep('otp');
      setCountdown(30);
      setCanResend(false);
      setSuccessToast(data.message || `Verification code sent to ${countryCode} ${phoneNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to send SMS verification code. Please check your number.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste of 6 digits
      const pastedDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pastedDigits.forEach((digit, i) => {
        if (index + i < 6) newDigits[index + i] = digit;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(index + pastedDigits.length, 5);
      otpInputsRef.current[nextIndex]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = value.replace(/\D/g, '');
    setOtpDigits(newDigits);

    // Auto move to next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    const enteredCode = otpDigits.join('');

    if (enteredCode.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/mobile/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          countryCode,
          otp: enteredCode,
          name: fullName,
          isSignUp: authMode === 'signup'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code. Please try again.');
      }

      // Establish persistent session
      localStorage.setItem('aaru_user_session', JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem('aaru_auth_token', data.token);
      }

      setSuccessToast(data.message || 'Verified successfully!');
      setTimeout(() => {
        onLoginSuccess(data.user);
        if (onClose) onClose();
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid or expired verification code. Please recheck.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseDemoOtp = () => {
    const codeToUse = demoOtpCode || '849201';
    setOtpDigits(codeToUse.split(''));
  };

  // Quick 1-click test logins
  const handleQuickLogin = (role: 'patron' | 'admin') => {
    if (role === 'patron') {
      const user: User = {
        id: 'usr-customer-1',
        email: 'anantharao2018@gmail.com',
        name: 'Anantha Rao',
        phone: '+1 (555) 234-5678',
        role: 'customer',
        addresses: []
      };
      localStorage.setItem('aaru_user_session', JSON.stringify(user));
      onLoginSuccess(user);
    } else {
      const adminUser: User = {
        id: 'usr-admin-1',
        email: 'admin@aaru.luxury',
        name: 'Atelier Director Moni',
        phone: '+91 98765 43210',
        role: 'admin',
        addresses: []
      };
      localStorage.setItem('aaru_user_session', JSON.stringify(adminUser));
      onLoginSuccess(adminUser);
    }
    if (onClose) onClose();
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
      {/* Background Atmosphere: Rich Designer Accents (Peacock teal, muted rose, gold, ivory) */}
      {!isModal && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#0F4C5C]/6 blur-3xl" />
          <div className="absolute top-1/2 -left-32 w-96 h-96 rounded-full bg-[#C08081]/8 blur-3xl" />
          <div className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full bg-[#8C6D37]/7 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#8C6D37_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        </div>
      )}

      {/* Main Centered Authentication Card */}
      <div 
        id="auth-card-container"
        className="w-full max-w-md bg-white border border-[#D4C7B5] shadow-2xl relative z-10 p-6 sm:p-8 transition-all"
      >
        {/* Close Button if opened as Modal */}
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

        {/* Brand Insignia & Clear Telugu / English Logo Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            {logoDisplayMode === 'telugu' ? (
              <AaruTeluguLogo size="lg" className="justify-center" />
            ) : logoDisplayMode === 'english' ? (
              <AaruEnglishLogo size="lg" className="items-center" />
            ) : (
              <AaruLogo size="lg" className="justify-center" />
            )}
          </div>

          {/* Discreet Logo View Selector */}
          <div className="inline-flex items-center gap-1 p-0.5 bg-[#FAF7F2] border border-[#E8DFD5] text-[10px] font-medium text-[#736B5E]">
            <button
              type="button"
              onClick={() => setLogoDisplayMode('dual')}
              className={`px-2 py-0.5 cursor-pointer transition-colors ${
                logoDisplayMode === 'dual' ? 'bg-[#0F4C5C] text-white font-semibold' : 'hover:text-[#24211E]'
              }`}
            >
              Atelier Dual
            </button>
            <button
              type="button"
              onClick={() => setLogoDisplayMode('telugu')}
              className={`px-2 py-0.5 cursor-pointer transition-colors ${
                logoDisplayMode === 'telugu' ? 'bg-[#0F4C5C] text-white font-semibold' : 'hover:text-[#24211E]'
              }`}
            >
              Telugu (ఆరు)
            </button>
            <button
              type="button"
              onClick={() => setLogoDisplayMode('english')}
              className={`px-2 py-0.5 cursor-pointer transition-colors ${
                logoDisplayMode === 'english' ? 'bg-[#0F4C5C] text-white font-semibold' : 'hover:text-[#24211E]'
              }`}
            >
              English (AARU)
            </button>
          </div>
        </div>

        {/* Segment Tabs: Login vs Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-[#F5EFE6] border border-[#D4C7B5] mb-6">
          <button
            id="tab-login"
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMessage('');
              setOtpStep('phone');
            }}
            className={`py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-white text-[#0F4C5C] border-b-2 border-[#C08081] shadow-xs font-bold'
                : 'text-[#5C5549] hover:text-[#24211E]'
            }`}
          >
            Log In
          </button>
          <button
            id="tab-signup"
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setErrorMessage('');
              setOtpStep('phone');
            }}
            className={`py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              authMode === 'signup'
                ? 'bg-white text-[#0F4C5C] border-b-2 border-[#C08081] shadow-xs font-bold'
                : 'text-[#5C5549] hover:text-[#24211E]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Global Error Message Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <p className="leading-snug">{errorMessage}</p>
          </div>
        )}

        {/* Success Toast */}
        {successToast && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <p className="leading-snug">{successToast}</p>
          </div>
        )}

        {/* ========================================================================= */}
        {/* Method 1: Google OAuth 2.0 Button */}
        {/* ========================================================================= */}
        <div className="space-y-4 mb-6">
          <button
            id="google-oauth-btn"
            type="button"
            onClick={handleInitiateGoogleAuth}
            disabled={isSubmitting || isGoogleLoading}
            className="w-full py-3 px-4 bg-white hover:bg-[#FAF9F5] border border-[#D4C7B5] text-[#24211E] text-xs font-semibold tracking-wide flex items-center justify-center gap-3 transition-all hover:shadow-xs cursor-pointer group disabled:opacity-50"
          >
            {/* Authentic 4-Color Google Logo SVG */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-[#24211E] font-medium">
              {authMode === 'login' ? 'Continue with Google' : 'Sign Up with Google'}
            </span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E8DFD5] w-full" />
            <span className="bg-white px-3 text-[10px] uppercase font-bold tracking-[0.16em] text-[#8C6D37] shrink-0">
              Or with Mobile Number
            </span>
            <div className="border-t border-[#E8DFD5] w-full" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Method 2: Mobile Number Authentication (SMS OTP) */}
        {/* ========================================================================= */}
        {otpStep === 'phone' ? (
          /* Step 2A: Phone Number Input Form */
          <form onSubmit={handleSendOtp} className="space-y-4">
            {/* Full Name in Sign Up Mode */}
            {authMode === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-[#C08081]">*</span>
                </label>
                <input
                  id="auth-full-name-input"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Anantha Rao"
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-[#D4C7B5] text-xs text-[#24211E] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-colors"
                />
              </div>
            )}

            {/* Mobile Number with Country Code Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-1.5">
                Mobile Number <span className="text-[#C08081]">*</span>
              </label>
              
              <div className="flex border border-[#D4C7B5] bg-[#FAF9F5] focus-within:border-[#0F4C5C] focus-within:bg-white transition-colors">
                {/* Country Code Select (Defaulting to +1 as specified) */}
                <div className="relative border-r border-[#D4C7B5] shrink-0 bg-[#F5EFE6]">
                  <select
                    id="country-code-select"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="h-full appearance-none pl-2.5 pr-6 py-2.5 bg-transparent text-xs font-semibold text-[#24211E] focus:outline-none cursor-pointer"
                  >
                    {COUNTRY_CODES.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.flag} {item.code}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-[#736B5E] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Phone Input */}
                <input
                  id="auth-phone-input"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="(555) 234-5678 or 98451 23098"
                  className="w-full px-3 py-2.5 bg-transparent text-xs text-[#24211E] focus:outline-none placeholder:text-[#A89F91]"
                />
              </div>
              <p className="text-[10px] text-[#736B5E] mt-1.5">
                We will dispatch a 6-digit SMS verification code to verify your atelier profile.
              </p>
            </div>

            {/* Send OTP Button with Loading Spinner */}
            <button
              id="send-otp-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Dispatching SMS Code...</span>
                </>
              ) : (
                <>
                  <span>Send OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2B: 6-Digit OTP Verification Screen */
          <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in duration-200">
            {/* Header info showing phone and Edit link */}
            <div className="flex items-center justify-between p-2.5 bg-[#F5EFE6] border border-[#E8DFD5] text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#0F4C5C]" />
                <span className="font-semibold text-[#24211E]">
                  {countryCode} {phoneNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOtpStep('phone');
                  setErrorMessage('');
                }}
                className="text-[11px] font-semibold text-[#0F4C5C] hover:underline cursor-pointer"
              >
                Change Number
              </button>
            </div>

            {/* 6-Digit Input Boxes */}
            <div>
              <label className="block text-[11px] font-semibold text-[#5C5549] uppercase tracking-wider mb-2 text-center">
                Enter 6-Digit Verification Code
              </label>

              <div className="flex justify-between gap-1.5 sm:gap-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputsRef.current[idx] = el)}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-10 h-12 sm:w-12 sm:h-12 text-center font-serif text-lg font-bold text-[#0F4C5C] bg-[#FAF9F5] border border-[#D4C7B5] focus:outline-none focus:border-[#0F4C5C] focus:bg-white transition-all shadow-xs"
                  />
                ))}
              </div>
            </div>

            {/* Demo Code Indicator & Quick Fill */}
            {demoOtpCode && (
              <div className="p-2.5 bg-[#FAF7F2] border border-[#D4C7B5] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8C6D37]" />
                  <span className="text-[#5C5549]">
                    Simulated SMS: Code is <strong className="text-[#0F4C5C] font-mono">{demoOtpCode}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleUseDemoOtp}
                  className="text-[10px] font-bold text-[#8C6D37] hover:underline uppercase tracking-wider"
                >
                  Auto-Fill
                </button>
              </div>
            )}

            {/* Verify OTP Button */}
            <button
              id="verify-otp-btn"
              type="submit"
              disabled={isSubmitting || otpDigits.join('').length !== 6}
              className="w-full py-3 px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-[0.16em] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Enter Atelier</span>
                </>
              )}
            </button>

            {/* Resend Code Countdown Timer */}
            <div className="text-center pt-1">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSubmitting}
                  className="text-xs font-semibold text-[#0F4C5C] hover:underline cursor-pointer uppercase tracking-wider"
                >
                  Resend Verification Code
                </button>
              ) : (
                <p className="text-xs text-[#736B5E]">
                  Resend code in <strong className="text-[#24211E] font-mono">{countdown}s</strong>
                </p>
              )}
            </div>
          </form>
        )}

        {/* Quick Demo Access & Guest Exploration */}
        <div className="mt-8 pt-5 border-t border-[#E8DFD5] space-y-3">
          {/* Continue as Guest Button */}
          {onContinueAsGuest && (
            <div className="text-center">
              <button
                type="button"
                id="continue-as-guest-btn"
                onClick={onContinueAsGuest}
                className="text-xs font-semibold text-[#0F4C5C] hover:text-[#0b3844] hover:underline cursor-pointer uppercase tracking-wider inline-flex items-center gap-1"
              >
                <span>Explore Atelier as Guest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick-fill 1-Click Evaluation Presets */}
          <div className="bg-[#FAF9F5] p-2.5 border border-[#E8DFD5] text-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C6D37] block mb-1.5">
              Rapid Evaluation Credentials
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('patron')}
                className="px-2.5 py-1 bg-white border border-[#D4C7B5] text-[10px] font-medium text-[#24211E] hover:border-[#0F4C5C] transition-colors cursor-pointer"
              >
                👤 Sign In as Patron (Anantha Rao)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="px-2.5 py-1 bg-white border border-[#D4C7B5] text-[10px] font-medium text-[#24211E] hover:border-[#0F4C5C] transition-colors cursor-pointer"
              >
                👑 Sign In as Director (Admin)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Interactive Google OAuth 2.0 Consent / Account Selection Dialog */}
      {/* ========================================================================= */}
      {showGoogleConsentModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white max-w-sm w-full border border-[#D4C7B5] shadow-2xl p-6 relative">
            <button
              type="button"
              onClick={() => {
                setShowGoogleConsentModal(false);
                setErrorMessage('Google Sign-In was cancelled.');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Google Header */}
            <div className="text-center mb-5">
              <div className="flex justify-center mb-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <h3 className="font-sans font-bold text-sm text-gray-900">Sign in with Google</h3>
              <p className="text-xs text-gray-500 mt-0.5">to continue to AARU Atelier Luxury Store</p>
            </div>

            {/* Account List */}
            <div className="divide-y divide-gray-100 border border-gray-200 mb-4">
              {/* Primary User Account */}
              <button
                type="button"
                onClick={() => handleConfirmGoogleAuth('anantharao2018@gmail.com', 'Anantha Rao')}
                disabled={isGoogleLoading}
                className="w-full p-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-[#0F4C5C] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  A
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-gray-900 group-hover:text-[#0F4C5C]">
                    Anantha Rao
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">anantharao2018@gmail.com</p>
                </div>
              </button>

              {/* Atelier Admin Account */}
              <button
                type="button"
                onClick={() => handleConfirmGoogleAuth('admin@aaru.luxury', 'Atelier Director Moni')}
                disabled={isGoogleLoading}
                className="w-full p-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-[#8C6D37] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  M
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-gray-900 group-hover:text-[#8C6D37]">
                    Atelier Director Moni (Admin)
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">admin@aaru.luxury</p>
                </div>
              </button>
            </div>

            {/* Or custom Google email entry */}
            <div className="space-y-2 mb-4">
              <label className="block text-[10px] uppercase font-bold text-gray-600">
                Or enter another Google account
              </label>
              <div className="flex gap-1.5">
                <input
                  type="email"
                  placeholder="your.name@gmail.com"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="w-full p-2 text-xs border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customGoogleEmail) {
                      handleConfirmGoogleAuth(customGoogleEmail);
                    }
                  }}
                  disabled={!customGoogleEmail || isGoogleLoading}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold uppercase disabled:opacity-40"
                >
                  Go
                </button>
              </div>
            </div>

            {isGoogleLoading && (
              <div className="flex items-center justify-center gap-2 py-2 text-xs text-[#0F4C5C] font-semibold">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Authenticating with Google OAuth...</span>
              </div>
            )}

            <div className="text-[10px] text-gray-400 text-center">
              AARU will access your name and email address to securely register and manage your atelier account.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
