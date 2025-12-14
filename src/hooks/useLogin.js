import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export function useLogin() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
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

  return {
    formData,
    formError,
    isLoading,
    showPassword,
    handleInputChange,
    handleSubmit,
    togglePassword: () => setShowPassword(!showPassword),
    handleCreateAccount: () => navigate('/register'),
  };
}
