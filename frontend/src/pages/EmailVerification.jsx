import React from "react";

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/common/Button";
import authService from "../services/auth.service.js";

function EmailVerification() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        await authService.verifyEmail(token);

        setVerified(true);

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err) {
        setError(err.response?.data?.message || "Email verification failed.");
      } finally {
        setLoading(false);
      }
    };

    verifyUserEmail();
  }, [token, navigate]);

  return (
    <AuthLayout title="Email Verification" subtitle="Please wait...">
      {loading ? (
        <div className="text-center space-y-4">
          <h2 className="text-lg font-semibold">Verifying your email...</h2>

          <p className="text-gray-500">
            Please wait while we verify your account.
          </p>
        </div>
      ) : verified ? (
        <div className="text-center space-y-4">
          <div className="text-6xl">✅</div>

          <h2 className="text-2xl font-bold text-green-600">Email Verified</h2>

          <p className="text-gray-500">
            Your account has been verified successfully.
          </p>

          <p className="text-sm text-gray-400">Redirecting to Login...</p>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="text-6xl">❌</div>

          <h2 className="text-2xl font-bold text-red-600">
            Verification Failed
          </h2>

          <p className="text-gray-500">{error}</p>

          <Link to="/login">
            <Button>Back to Login</Button>
          </Link>
        </div>
      )}
    </AuthLayout>
  );
}

export default EmailVerification;
