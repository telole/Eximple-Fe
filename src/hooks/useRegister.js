import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { validateRegisterForm } from '../utils/validation';
import { formatRegistrationError } from '../utils/errorMessages';

export function useRegister() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
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
        // Format error message to be user-friendly
        // Check if error has data property (from API error handler)
        let errorToFormat = result.error;
        if (result.error?.data) {
          // Extract error from data.errors array or data.message
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
      // Format error message to be user-friendly
      // Check if error has data property (from API error handler)
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
  };
}



