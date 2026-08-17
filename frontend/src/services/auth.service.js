import api from "../lib/axios.js";

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
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

const resetPassword = async (token, newPassword) => {
  const response = await api.post(
    `/auth/reset-password/${token}`,
    {
      newPassword,
    }
  );

  return response.data;
};

const verifyEmail = async (token) => {
  const response = await api.get(
    `/auth/verify-email/${token}`
  );

  return response.data;
};

const resendVerificationEmail = async (email) => {
  const response = await api.post(
    "/auth/resend-verification-email",
    {
      email,
    }
  );

  return response.data;
};
const googleLogin = async (credential) => {
  const response = await api.post(
    "/auth/google",
    {
      credential,
    }
  );

  return response.data;
};

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      originalRequest.url?.includes(
        "/auth/refresh-token"
      )
    ) {
      console.log(
        "Refresh token request failed:",
        error.response?.status
      );

      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        console.log(
          "Access token expired. Trying refresh token..."
        );

        // Refresh access token
        await api.post("/auth/refresh-token");

        console.log(
          "Access token refreshed successfully"
        );

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        console.log(
          "Refresh token failed:",
          refreshError.response?.status
        );

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
  googleLogin,
};

export default authService;