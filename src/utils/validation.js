export const validateUsername = (username) => {
  if (!username) {
    return 'Username is required';
  }
  if (username.length < 3 || username.length > 100) {
    return 'Username must be between 3 and 100 characters';
  }
  if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(username)) {
    return 'Username must start with a letter and can only contain letters, numbers, underscore, and dash';
  }
  return null;
};

export const validatePassword = (password, username = '', email = '') => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8 || password.length > 128) {
    return 'Password must be between 8 and 128 characters';
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[@$!%*?&#^()_+\-=\[\]{}|;:,.<>~]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return 'Password must contain uppercase, lowercase, number, and special character (@$!%*?&#^()_+-=[]{}|;:,.<>~)';
  }

  if (password.toLowerCase() === username.toLowerCase() || 
      password.toLowerCase() === email.toLowerCase()) {
    return 'Password cannot be the same as username or email';
  }

  return null;
};

export const validateRegisterForm = (formData) => {
  if (!formData.username || !formData.email || !formData.password || !formData.confirm_password) {
    return 'All fields are required';
  }

  const usernameError = validateUsername(formData.username);
  if (usernameError) return usernameError;

  const passwordError = validatePassword(formData.password, formData.username, formData.email);
  if (passwordError) return passwordError;

  if (formData.password !== formData.confirm_password) {
    return 'Passwords do not match';
  }

  return null;
};

