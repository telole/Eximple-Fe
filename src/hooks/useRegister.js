import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { validateRegisterForm } from '../utils/validation';
import { formatRegistrationError } from '../utils/errorMessages';

export function useRegister() {
  const navigate = useNavigate();
  const { register, googleLogin, isLoading } = useAuthStore();
  const [formError, setFormError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const validationError = validateRegisterForm(formData);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      const result = await register(formData);
      if (result.success) {
        navigate('/otp', { state: { email: formData.email } });
      } else {
        let errorToFormat = result.error;
        if (result.error?.data) {
          const data = result.error.data;
          if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
            errorToFormat = data.errors.map(err => err.message || err).join(', ');
          } else {
            errorToFormat = data.message || data.error || result.error.message || 'Registration failed';
          }
        } else if (result.error?.message) {
          errorToFormat = result.error.message;
        }
        const formattedError = formatRegistrationError(errorToFormat || 'Registration failed');
        setFormError(formattedError);
      }
    } catch (error) {
      let errorToFormat = error.message;
      if (error.data) {
        const data = error.data;
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          errorToFormat = data.errors.map(err => err.message || err).join(', ');
        } else {
          errorToFormat = data.message || data.error || error.message || 'Registration failed. Please check your input.';
        }
      }
      const formattedError = formatRegistrationError(errorToFormat || 'Registration failed. Please check your input.');
      setFormError(formattedError);
    }
  };

  const handleGoogleRegister = async (credentialResponse) => {
    setFormError(null);
    if (!credentialResponse?.credential) {
      setFormError('Google registration failed. No credential received.');
      return;
    }

    try {
      const result = await googleLogin(credentialResponse.credential);
      if (result.success) {
        if (result.data.user.profile_complete) {
          navigate('/journey');
        } else {
          navigate('/class-now');
        }
      } else {
        setFormError(result.error || 'Google registration failed. Please try again.');
      }
    } catch (error) {
      setFormError(error.message || 'Google registration failed. Please check your connection and try again.');
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
      setFormError(`Google registration failed: ${error?.error || error?.type || 'Unknown error'}. Please check Google Cloud Console settings.`);
    }
  };

  return {
    formData,
    formError,
    isLoading,
    showPassword,
    showConfirmPassword,
    handleInputChange,
    handleSubmit,
    togglePassword: () => setShowPassword(!showPassword),
    toggleConfirmPassword: () => setShowConfirmPassword(!showConfirmPassword),
    handleLogin: () => navigate('/login'),
    handleGoogleRegister,
    handleGoogleError,
  };
}



