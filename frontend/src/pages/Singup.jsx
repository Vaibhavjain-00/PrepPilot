import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
import Button from "../components/common/Button";
import GoogleLoginButton from "../components/GoogleLoginButton";
import authService from "../services/auth.service.js";

function Signup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError("");

      await authService.signup({
        fullname: data.fullname,
        email: data.email,
        password: data.password,
      });

      navigate("/verify-email", {
  state: {
    email: data.email,
  },
});
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join PrepPilot"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <Input
          label="Full Name"
          placeholder="John Doe"
          {...register("fullname", {
            required: "Full name is required",
          })}
          error={errors.fullname}
        />

        <Input
          label="Email"
          placeholder="abc@gmail.com"
          {...register("email", {
            required: "Email is required",
          })}
          error={errors.email}
        />

        <PasswordInput
          label="Password"
          placeholder="********"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message:
                "Password must contain at least 8 characters",
            },
          })}
          error={errors.password}
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="********"
          {...register("confirmPassword", {
            required: "Confirm your password",
            validate: (value) =>
              value === password ||
              "Passwords do not match",
          })}
          error={errors.confirmPassword}
        />

        {serverError && (
          <p className="text-red-500 text-sm">
            {serverError}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </Button>

        <p className="text-center text-sm">
          Already have an account?

          <Link
            to="/login"
            className="ml-2 text-blue-600 font-medium"
          >
            Login
          </Link>
        </p>
      </form>
      <div className="flex items-center my-6">
  <div className="flex-1 border-t border-gray-300"></div>

  <span className="px-3 text-gray-500 text-sm">
    OR
  </span>

  <div className="flex-1 border-t border-gray-300"></div>
</div>

<GoogleLoginButton />
    </AuthLayout>
  );
}

export default Signup;