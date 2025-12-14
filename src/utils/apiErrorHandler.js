export const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  
  const text = await response.text();
  throw new Error(text || 'Request failed');
};

export const handleApiError = (data, response) => {
  if (!response.ok) {
    // Handle different HTTP status codes
    let errorMessage = 'Request failed';
    
    if (response.status === 500) {
      // Try to extract detailed error message from 500 response
      if (data.error) {
        errorMessage = typeof data.error === 'string' ? data.error : (data.error.message || 'Server error (500)');
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        errorMessage = data.errors.map(err => err.message || err).join(', ');
      } else {
        errorMessage = 'Server error (500). Masalah terjadi di backend. Silakan coba lagi nanti atau hubungi administrator.';
      }
    } else if (response.status === 404) {
      errorMessage = data.message || data.error || 'Resource tidak ditemukan.';
    } else if (response.status === 401) {
      errorMessage = data.message || data.error || 'Unauthorized. Silakan login kembali.';
    } else if (response.status === 403) {
      errorMessage = data.message || data.error || 'Forbidden. Anda tidak memiliki izin untuk aksi ini.';
    } else if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      const errorMessages = data.errors.map(err => err.message || err.field || err).join(', ');
      errorMessage = errorMessages || data.message || 'Validation error';
    } else if (data.message) {
      errorMessage = data.message;
    } else if (data.error) {
      errorMessage = typeof data.error === 'string' ? data.error : (data.error.message || 'Request failed');
    }
    
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
};



