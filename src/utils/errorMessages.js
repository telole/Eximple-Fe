/**
 * Converts backend error messages to user-friendly messages
 * @param {string} errorMessage - The error message from backend
 * @returns {string} - User-friendly error message
 */
export const formatRegistrationError = (errorMessage) => {
  if (!errorMessage || typeof errorMessage !== 'string') {
    return 'Registration failed. Please check your input.';
  }

  const error = errorMessage.toLowerCase();

  // Password validation errors
  if (error.includes('password') && error.includes('uppercase')) {
    return 'Password must contain at least one uppercase letter';
  }
  if (error.includes('password') && error.includes('lowercase')) {
    return 'Password must contain at least one lowercase letter';
  }
  if (error.includes('password') && error.includes('number') || error.includes('digit')) {
    return 'Password must contain at least one number';
  }
  if (error.includes('password') && (error.includes('special') || error.includes('symbol') || error.includes('character'))) {
    return 'Password must contain at least one special character (@$!%*?&#^()_+-=[]{}|;:,.<>~)';
  }
  if (error.includes('password') && (error.includes('length') || error.includes('8') || error.includes('minimum'))) {
    return 'Password must be at least 8 characters long';
  }
  if (error.includes('password') && (error.includes('maximum') || error.includes('128'))) {
    return 'Password must not exceed 128 characters';
  }
  if (error.includes('password') && error.includes('required')) {
    return 'Password is required';
  }
  if (error.includes('password') && error.includes('weak') || error.includes('too simple')) {
    return 'Password is too weak. Please use a stronger password with uppercase, lowercase, numbers, and special characters';
  }

  // Username validation errors
  if (error.includes('username') && error.includes('taken') || error.includes('already exists') || error.includes('duplicate')) {
    return 'Username is already taken. Please choose another username';
  }
  if (error.includes('username') && (error.includes('length') || error.includes('3') || error.includes('100'))) {
    return 'Username must be between 3 and 100 characters';
  }
  if (error.includes('username') && (error.includes('invalid') || error.includes('format') || error.includes('character'))) {
    return 'Username must start with a letter and can only contain letters, numbers, underscore, and dash';
  }
  if (error.includes('username') && error.includes('required')) {
    return 'Username is required';
  }

  // Email validation errors
  if (error.includes('email') && (error.includes('taken') || error.includes('already exists') || error.includes('duplicate') || error.includes('already registered'))) {
    return 'Email is already registered. Please use another email or try logging in';
  }
  if (error.includes('email') && (error.includes('invalid') || error.includes('format') || error.includes('valid'))) {
    return 'Please enter a valid email address';
  }
  if (error.includes('email') && error.includes('required')) {
    return 'Email is required';
  }

  // General validation errors
  if (error.includes('validation') || error.includes('invalid input')) {
    return 'Please check your input and try again';
  }
  if (error.includes('required') && !error.includes('password') && !error.includes('username') && !error.includes('email')) {
    return 'All fields are required';
  }

  // Server errors
  if (error.includes('500') || error.includes('internal server error')) {
    return 'Server error. Please try again later';
  }
  if (error.includes('network') || error.includes('connection') || error.includes('fetch')) {
    return 'Network error. Please check your internet connection';
  }

  // If no specific pattern matches, return a generic message
  // But try to make it more user-friendly by removing technical details
  if (error.includes('error') || error.includes('failed')) {
    return 'Registration failed. Please check your input and try again';
  }

  // Return original message if it's already user-friendly
  return errorMessage;
};

/**
 * Formats error messages from API response
 * @param {any} error - Error object or message from API
 * @returns {string} - Formatted error message
 */
export const formatApiError = (error) => {
  if (!error) {
    return 'An error occurred. Please try again.';
  }

  // If it's already a string, format it
  if (typeof error === 'string') {
    return formatRegistrationError(error);
  }

  // If it's an error object with data property (from handleApiError)
  if (error.data) {
    const data = error.data;
    
    // Handle array of errors
    if (data.errors && Array.isArray(data.errors)) {
      const messages = data.errors.map(err => {
        if (typeof err === 'string') return formatRegistrationError(err);
        if (err.message) return formatRegistrationError(err.message);
        if (err.field && err.message) {
          return formatRegistrationError(`${err.field}: ${err.message}`);
        }
        return formatRegistrationError(String(err));
      });
      return messages.join('. ');
    }
    
    // Handle single error message
    if (data.message) {
      return formatRegistrationError(data.message);
    }
    
    if (data.error) {
      return formatRegistrationError(typeof data.error === 'string' ? data.error : data.error.message || '');
    }
  }

  // If it's an error object with message
  if (error.message) {
    return formatRegistrationError(error.message);
  }

  // If it's an error object with error property
  if (error.error) {
    return formatRegistrationError(typeof error.error === 'string' ? error.error : error.error.message || '');
  }

  // If it's an array of errors
  if (Array.isArray(error)) {
    const messages = error.map(err => {
      if (typeof err === 'string') return formatRegistrationError(err);
      if (err.message) return formatRegistrationError(err.message);
      if (err.field && err.message) {
        return formatRegistrationError(`${err.field}: ${err.message}`);
      }
      return formatRegistrationError(String(err));
    });
    return messages.join('. ');
  }

  return 'An error occurred. Please try again.';
};

