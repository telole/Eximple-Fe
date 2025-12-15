import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export function useLogin() {
  const navigate = useNavigate();
  const { login, googleLogin, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.email || !formData.password) {
      setFormError('Email and password are required');
      return;
    }

    const result = await login(formData.email, formData.password);
    if (result.success) {
      if (result.data.user.profile_complete) {
        navigate('/journey');
      } else {
        navigate('/class-now');
      }
    } else {
      setFormError(result.error || 'Login failed');
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setFormError(null);
    if (!credentialResponse?.credential) {
      setFormError('Google login failed. Please try again.');
      return;
    }

    const result = await googleLogin(credentialResponse.credential);
    if (result.success) {
      if (result.data.user.profile_complete) {
        navigate('/journey');
      } else {
        navigate('/class-now');
      }
    } else {
      setFormError(result.error || 'Google login failed');
    }
  };

  const handleGoogleError = (error) => {
    if (error?.error === 'popup_closed_by_user') {
      setFormError('Google sign-in was cancelled. Please try again.');
    } else if (error?.error === 'access_denied') {
      setFormError('Access denied. Please allow Google sign-in permissions.');
    } else if (error?.error === 'idpiframe_initialization_failed') {
      setFormError('Google sign-in failed. Please check your Google Client ID configuration.');
    } else {
      setFormError(`Google login failed: ${error?.error || error?.type || 'Unknown error'}. Please check Google Cloud Console settings.`);
    }
  };

  return {
    formData,
    formError,
    isLoading,
    showPassword,
    handleInputChange,
    handleSubmit,
    togglePassword: () => setShowPassword(!showPassword),
    handleCreateAccount: () => navigate('/register'),
    handleGoogleLogin,
    handleGoogleError,
  };
}
