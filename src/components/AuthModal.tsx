import React from 'react';
import { User } from '../types';
import { AuthScreen } from './AuthScreen';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  return (
    <AuthScreen
      isModal={true}
      onClose={onClose}
      onLoginSuccess={(user) => {
        onLoginSuccess(user);
        onClose();
      }}
    />
  );
};
