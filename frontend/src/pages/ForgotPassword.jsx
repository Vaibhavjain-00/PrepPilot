import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
import Button from "../components/common/Button";

import authService from "../services/auth.service.js";

function ForgotPassword() {

    const [loading, setLoading] = useState(false);
      const [serverError, setServerError] = useState("");
      const [successMessage, setSuccessMessage] = useState("");
    
      const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm();

    const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError("");
       setSuccessMessage("");

      const response = await authService.forgotPassword({
  email: data.email,
});

setSuccessMessage(response.message);

    } catch (error) {

      setServerError(
        error.response?.data?.message ||
          "There is problem in sending email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle=""
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >

        <Input
          label="Email"
          placeholder="abc@gmail.com"
          {...register("email", {
            required: "Email is required",
          })}
          error={errors.email}
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

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Sending..."
            : "Send"}
        </Button>

    
      </form>
    </AuthLayout>
  )
}

export default ForgotPassword