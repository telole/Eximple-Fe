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
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      const errorMessages = data.errors.map(err => err.message || err.field).join(', ');
      throw new Error(errorMessages || data.message || 'Validation error');
    }
    throw new Error(data.message || 'Request failed');
  }
  return data;
};



