import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { validateRegisterForm } from '../utils/validation';

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
        setFormError(result.error || 'Registration failed');
      }
    } catch (error) {
      setFormError(error.message || 'Registration failed. Please check your input.');
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



