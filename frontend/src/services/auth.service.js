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
  const response = await api.post("/auth/google", {
    credential,
  });

  return response.data;
};

api.interceptors.response.use(
(response)=>{
    return response;
},
async(error)=>{

    if(error.response.status===401){

        const res = await api.post("/auth/refresh-token");

        localStorage.setItem(
            "accessToken",
            res.data.accessToken
        );

        return api(error.config);
    }

    return Promise.reject(error);
});

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