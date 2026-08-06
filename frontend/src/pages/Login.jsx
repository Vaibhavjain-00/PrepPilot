import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useState } from "react";

import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
import Button from "../components/common/Button";

import authService from "../services/auth.service.js";
import { login } from "../store/authSlice.js";
import GoogleLoginButton from "../components/GoogleLoginButton";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError("");

      const response = await authService.login(data);

      dispatch(
        login({
          userData: response.data.user,
        }),
      );

      navigate("/");
    } catch (error) {
      setServerError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back 👋" subtitle="Sign in to continue">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email"
          placeholder="Enter your email"
          {...register("email", {
            required: "Email is required",
          })}
          error={errors.email}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter password"
          {...register("password", {
            required: "Password is required",
          })}
          error={errors.password}
        />

        {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

        <div className="flex justify-center">
          <Button type="submit" disabled={loading} className="w-40">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>

        <div className="flex justify-between text-sm">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>

          <Link to="/signup" className="text-blue-600 hover:underline">
            Create Account
          </Link>
        </div>
      </form>
      <div className="my-5 flex items-center">
  <div className="flex-1 border-t"></div>

  <span className="px-3 text-gray-500">
    OR
  </span>

  <div className="flex-1 border-t"></div>
</div>

<GoogleLoginButton />
    </AuthLayout>
  );
}

export default Login;
