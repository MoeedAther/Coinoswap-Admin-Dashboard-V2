import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API base URL - adjust this to match your backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Async thunks for API calls
export const loginAdmin = createAsyncThunk(
  'auth/login',
  async ({ email, password, twoFactorCode }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for session cookies
        body: JSON.stringify({
          email,
          password,
          ...(twoFactorCode && { twoFactorCode }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Login failed' });
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Logout failed' });
    }
  }
);

export const getSession = createAsyncThunk(
  'auth/getSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/session`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Session check failed' });
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword, twoFactorCode }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword,
          ...(twoFactorCode && { twoFactorCode }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Password change failed' });
    }
  }
);

export const enable2FA = createAsyncThunk(
  'auth/enable2FA',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/2fa/enable`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to enable 2FA' });
    }
  }
);

export const verify2FA = createAsyncThunk(
  'auth/verify2FA',
  async ({ twoFactorCode }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/2fa/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          twoFactorCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to verify 2FA' });
    }
  }
);

export const disable2FA = createAsyncThunk(
  'auth/disable2FA',
  async ({ password, twoFactorCode }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/2fa/disable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          password,
          ...(twoFactorCode && { twoFactorCode }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message || 'Failed to disable 2FA' });
    }
  }
);

const initialState = {
  admin: null,
  isAuthenticated: false,
  isLoading: true, // Start as true to prevent premature redirects
  error: null,
  requires2FA: false,
  sessionChecked: false, // Track if session has been checked
  twoFA: {
    qrCode: null,
    secret: null,
    isEnabling: false,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clear2FA: (state) => {
      state.requires2FA = false;
    },
    clear2FASetup: (state) => {
      state.twoFA.qrCode = null;
      state.twoFA.secret = null;
      state.twoFA.isEnabling = false;
    },
    setAuth: (state, action) => {
      state.admin = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.requires2FA = false;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
        state.error = null;
        state.requires2FA = false;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
        state.requires2FA = action.payload?.requires2FA || false;
      });

    // Logout
    builder
      .addCase(logoutAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.admin = null;
        state.error = null;
        state.requires2FA = false;
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.isLoading = false;
        // Even if logout fails, clear local state
        state.isAuthenticated = false;
        state.admin = null;
        state.error = action.payload?.message || 'Logout failed';
      });

    // Get Session
    builder
      .addCase(getSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
        state.error = null;
        state.sessionChecked = true;
      })
      .addCase(getSession.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.admin = null;
        state.sessionChecked = true;
        // Don't set error for session check failures (user might not be logged in)
      });

    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.requires2FA = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.requires2FA = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Password change failed';
        state.requires2FA = action.payload?.requires2FA || false;
      });

    // Enable 2FA
    builder
      .addCase(enable2FA.pending, (state) => {
        state.twoFA.isEnabling = true;
        state.error = null;
      })
      .addCase(enable2FA.fulfilled, (state, action) => {
        state.twoFA.isEnabling = false;
        state.twoFA.qrCode = action.payload.qrCode;
        state.twoFA.secret = action.payload.secret;
        state.error = null;
      })
      .addCase(enable2FA.rejected, (state, action) => {
        state.twoFA.isEnabling = false;
        state.error = action.payload?.message || 'Failed to enable 2FA';
      });

    // Verify 2FA
    builder
      .addCase(verify2FA.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verify2FA.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admin = { ...state.admin, twoFactorEnabled: true };
        state.twoFA.qrCode = null;
        state.twoFA.secret = null;
        state.twoFA.isEnabling = false;
        state.error = null;
      })
      .addCase(verify2FA.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to verify 2FA';
      });

    // Disable 2FA
    builder
      .addCase(disable2FA.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(disable2FA.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admin = { ...state.admin, twoFactorEnabled: false };
        state.error = null;
      })
      .addCase(disable2FA.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to disable 2FA';
      });
  },
});

export const { clearError, clear2FA, clear2FASetup, setAuth } = authSlice.actions;
export default authSlice.reducer;

