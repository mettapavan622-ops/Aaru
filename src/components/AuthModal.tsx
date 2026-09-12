import React from 'react';
import { User } from '../types';
import { AuthScreen } from './AuthScreen';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess, initialMode = 'login' }) => {
  if (!isOpen) return null;

  return (
    <AuthScreen
      isModal={true}
      onClose={onClose}
      initialMode={initialMode}
      onLoginSuccess={(user) => {
        onLoginSuccess(user);
        onClose();
      }}
    />
  );
};
