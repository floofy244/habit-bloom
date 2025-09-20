# API Implementation Documentation

## Overview
This document describes the implementation of a dedicated Axios instance for handling API requests with automatic JWT token management.

## Files Modified

### 1. `src/api.js` (NEW)
- Created a dedicated Axios instance with base URL set to `https://habitbloom.onrender.com/api/`
- Implemented request interceptor to automatically attach JWT tokens
- Implemented response interceptor for automatic token refresh on 401 errors
- Added comprehensive logging for debugging

### 2. `src/contexts/AuthContext.js`
- Updated to use the new `api` instance instead of creating its own
- Maintained backward compatibility by exporting `api` as `apiClient`
- Updated all authentication endpoints to use full URLs
- Ensured proper token storage in localStorage

### 3. Component Updates
- **Dashboard.js**: Updated to use `api` instance instead of `apiClient`
- **Habits.js**: Updated to use `api` instance instead of `apiClient`
- **Profile.js**: Updated to use `api` instance instead of `apiClient`
- **Login.js** and **Register.js**: No changes needed (use AuthContext methods)

## Key Features

### Automatic Token Attachment
Every request made with the `api` instance automatically includes the JWT token:
```javascript
import api from '../api';

// This will automatically include the Authorization header
const response = await api.get('habits/');
```

### Token Refresh
The implementation includes automatic token refresh:
- On 401 errors, the system attempts to refresh the token using the refresh token
- If refresh succeeds, the original request is retried
- If refresh fails, the user is redirected to login

### Error Handling
- Comprehensive error logging for debugging
- Graceful handling of token refresh failures
- Automatic cleanup of invalid tokens

## Usage Examples

### Basic API Calls
```javascript
import api from '../api';

// GET request
const habits = await api.get('habits/');

// POST request
const newHabit = await api.post('habits/', habitData);

// PUT request
const updatedHabit = await api.put(`habits/${id}/`, updateData);

// DELETE request
await api.delete(`habits/${id}/`);
```

### Error Handling
```javascript
try {
  const response = await api.get('habits/');
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Token refresh handled automatically
  } else {
    // Handle other errors
  }
}
```

## Testing

A test file `src/test-api.js` is included to verify the implementation:
```javascript
import { testApiConfiguration, testApiCall } from './test-api';

// Test configuration
const config = testApiConfiguration();
console.log('API Configuration:', config);

// Test API call
const result = await testApiCall();
console.log('API Call Result:', result);
```

## Benefits

1. **Centralized Configuration**: All API settings in one place
2. **Automatic Token Management**: No need to manually attach tokens
3. **Consistent Error Handling**: Unified approach to token refresh
4. **Better Debugging**: Comprehensive logging for troubleshooting
5. **Maintainability**: Easy to update API configuration

## Migration Notes

- All existing `apiClient` imports have been updated to use the new `api` instance
- The old `apiClient` is still exported for backward compatibility
- No breaking changes to existing component logic
- All API endpoints now use the production URL: `https://habitbloom.onrender.com/api/`
