import { useState } from "react";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/common/Button";
import authService from "../services/auth.service";
import { useLocation } from "react-router-dom";


function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const location = useLocation();

  const email = location.state?.email;
  const handleResend = async () => {

  try {
    const response = await authService.resendVerificationEmail(email);

    setSuccessMessage(response.message);
  } catch (error) {

    setServerError(
      error.response?.data?.message ||
      "Failed to resend verification email."
    );
  }
};

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="One more step..."
    >
      <div className="space-y-5 text-center">

        <div className="text-6xl">
          📧
        </div>

        <p>
          We have sent a verification link to your email.
        </p>

        <p className="text-gray-500 text-sm">
          Click the link in your inbox to activate your account.
        </p>

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
          onClick={handleResend}
          disabled={loading}
        >
          {loading ? "Sending..." : "Resend Verification Email"}
        </Button>

      </div>
    </AuthLayout>
  );
}

export default VerifyEmail;