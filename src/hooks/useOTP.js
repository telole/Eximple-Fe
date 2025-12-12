import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export function useOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, requestOTP, isLoading } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email] = useState(location.state?.email || 'user@gmail.com');
  const [error, setError] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPComplete = useCallback(async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter complete OTP code');
      return;
    }

    setError(null);
    const result = await verifyEmail(email, otpCode);
    
    if (result.success) {
      if (result.data.user.profile_complete) {
        navigate('/journey');
      } else {
        navigate('/class-grade');
      }
    } else {
      setError(result.error || 'Invalid OTP code');
    }
  }, [otp, email, verifyEmail, navigate]);

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setError(null);
    setResendCooldown(30);
    const result = await requestOTP(email);
    
    if (!result.success) {
      setError(result.error || 'Failed to resend OTP');
    }
  };

  useEffect(() => {
    const otpCode = otp.join('');
    if (otpCode.length === 6 && otp.every(digit => digit !== '')) {
      handleOTPComplete();
    }
  }, [otp, handleOTPComplete]);

  return {
    otp,
    email,
    error,
    isLoading,
    resendCooldown,
    inputRefs,
    handleInputChange,
    handleKeyDown,
    handleOTPComplete,
    handleResendOTP,
  };
}

