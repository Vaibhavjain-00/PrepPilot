import api from "../lib/axios.js";
import store from "../store/store";

const signup = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

const getCurrentUser = async () => {
  const response = await api.get("/auth/current-user");
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", email );
  return response.data;
};

const resetPassword = async (token, newPassword) => {
  const response = await api.post(`/auth/reset-password/${token}`, {
    newPassword,
  });

  return response.data;
};

const verifyEmail = async (token) => {
  const response = await api.get(`/auth/verify-email/${token}`);
  return response.data;
};

const resendVerificationEmail = async (email) => {
  const response = await api.post(
    "/auth/resend-verification-email",
    {email}
  );

  return response.data;
};

const googleLogin = async (credential) => {
  return await api.post(
    "/auth/google",
    { credential },
    {
      withCredentials: true,
    }
  );
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Refresh token API ko dobara refresh mat karo
    if (originalRequest.url.includes("/refresh-token")) {
      // logout
      store.dispatch(logout());

      window.location.href = "/login";

      return Promise.reject(error);
    }

    // Access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh-token");

        // Refresh successful → original request retry
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token expired/invalid
        store.dispatch(logout());

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const authService = {
  signup,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  googleLogin
};

export default authService;