import { Link, useNavigate,useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
import Button from "../components/common/Button";

import authService from "../services/auth.service.js";
function ResetPassword() {
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      setSuccessMessage("");

      const response = await authService.resetPassword(token, data.password);

      setSuccessMessage(response.data.message);
    } catch (error) {
      setServerError(
        error.response?.data?.message || "There is problem in sending email",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <PasswordInput
          label="New Password"
          placeholder="********"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must contain at least 8 characters",
            },
          })}
          error={errors.password}
        />

        <PasswordInput
          label="Confirm New Password"
          placeholder="********"
          {...register("confirmPassword", {
            required: "Confirm your password",
            validate: (value) => value === password || "Passwords do not match",
          })}
          error={errors.confirmPassword}
        />

        {successMessage && (
          <div className="rounded-lg bg-green-100 border border-green-300 p-3 text-green-700 text-sm">
            {successMessage}
          </div>
        )}

        {serverError && (
          <div className="rounded-lg bg-red-100 border border-red-300 p-3 text-red-700 text-sm">
            {serverError}
          </div>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default ResetPassword;
