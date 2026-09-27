import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Shield, ArrowLeft, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { User } from '../../types';
import { AaruLogo } from '../AaruLogo';

interface AdminLoginPageProps {
  onLoginSuccess: (adminUser: User, token: string) => void;
  onReturnToStore: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onReturnToStore
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both administrator email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Generic error message without leaking sensitive information
        setErrorMessage(data.error || 'Invalid administrator email or password.');
        return;
      }

      // Store authenticated admin credentials in localStorage
      if (data.token) {
        localStorage.setItem('aaru_auth_token', data.token);
      }
      localStorage.setItem('aaru_user_session', JSON.stringify(data.user));

      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setErrorMessage('Unable to connect to the authentication server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#181614] text-[#FAF7F2] flex flex-col justify-center items-center p-4 relative selection:bg-[#0F4C5C]/40 selection:text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#0F4C5C]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#8C6D37]/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#8C6D37_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      </div>

      {/* Return to Storefront Link */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between z-10">
        <button
          type="button"
          onClick={onReturnToStore}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A89882] hover:text-[#FAF7F2] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </button>

        <span className="text-[10px] font-mono tracking-widest text-[#8C6D37] uppercase">
          SECURE PORTAL
        </span>
      </div>

      {/* Main Admin Authentication Card */}
      <div 
        id="admin-login-card"
        className="w-full max-w-md bg-[#24211E] border border-[#3D3730] shadow-2xl p-6 sm:p-8 relative z-10 rounded-none animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8C6D37] via-[#0F4C5C] to-[#8C6D37]" />

        {/* Brand Header */}
        <div className="text-center mb-6 pt-2">
          <div className="flex justify-center mb-2">
            <AaruLogo size="md" variant="dark" layout="centered" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0F4C5C]/30 border border-[#0F4C5C]/50 text-[#FAF7F2] mt-2 text-[10px] font-bold uppercase tracking-widest">
            <Shield className="w-3 h-3 text-[#8C6D37]" />
            <span>Administrator Security Gate</span>
          </div>
          <p className="text-xs text-[#A89882] mt-2">
            Sign in with authorized administrator credentials to manage catalog, orders, and customer permissions.
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Admin Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="admin-email" 
              className="block text-[11px] font-semibold uppercase tracking-wider text-[#D4C7B5] mb-1.5"
            >
              Administrator Email <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarubymoni@admin.co.in"
                className="w-full pl-10 pr-3.5 py-3 bg-[#1A1816] border border-[#4D463F] focus:border-[#0F4C5C] focus:bg-[#151312] text-xs text-[#FAF7F2] placeholder:text-[#6E665B] focus:outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-[#8C6D37] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label 
              htmlFor="admin-password" 
              className="block text-[11px] font-semibold uppercase tracking-wider text-[#D4C7B5] mb-1.5"
            >
              Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter administrator password"
                className="w-full pl-10 pr-10 py-3 bg-[#1A1816] border border-[#4D463F] focus:border-[#0F4C5C] focus:bg-[#151312] text-xs text-[#FAF7F2] placeholder:text-[#6E665B] focus:outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-[#8C6D37] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A8175] hover:text-[#FAF7F2] p-1 cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Credential Hint for Verified Local Deployment */}
          <div className="p-2.5 bg-[#1C1A17] border border-[#3D3730] text-[11px] text-[#A89882] space-y-1">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-[#8C6D37] font-semibold">Default Seeded Admin:</span>
              <button
                type="button"
                onClick={() => {
                  setEmail('aarubymoni@admin.co.in');
                  setPassword('aarubymoni@1');
                }}
                className="text-xs text-[#0F4C5C] hover:underline cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
            <div className="font-mono text-[10px] text-[#C4B7A5]">aarubymoni@admin.co.in</div>
          </div>

          <button
            id="admin-login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#0F4C5C] hover:bg-[#0b3844] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer mt-2"
          >
            {isLoading ? (
              <span>Authenticating Administrator...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In to Admin Dashboard</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
