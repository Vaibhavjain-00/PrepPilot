import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import authService from "../services/auth.service.js";
import { login } from "../store/authSlice";

function GoogleLoginButton() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {

    try {

      const response = await authService.googleLogin(
        credentialResponse.credential
      );

      dispatch(
        login({
          userData: response.data.user,
        })
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      alert("Google Login Failed");

    }

  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => alert("Google Login Failed")}
    />
  );
}

export default GoogleLoginButton;