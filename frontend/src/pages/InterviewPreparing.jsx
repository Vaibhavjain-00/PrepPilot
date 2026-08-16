import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import interviewService from "../services/interview.service";

const InterviewPreparing = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response =
          await interviewService.getInterview(
            interviewId
          );

        setInterview(
          response.data.interview
        );
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Unable to load interview"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">

          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <h2 className="text-xl font-semibold">
            Preparing your interview...
          </h2>

          <p className="mt-2 text-gray-500">
            Generating personalized questions
            from your resume.
          </p>

        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">

          <p className="text-red-500">
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="mt-4 rounded-lg bg-black px-5 py-2 text-white"
          >
            Back to Dashboard
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">

      <div className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow">

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
          ✓
        </div>

        <h1 className="text-2xl font-bold">
          Your Interview is Ready
        </h1>

        <p className="mt-2 text-gray-500">
          {interview.role}
          {interview.company &&
            ` • ${interview.company}`}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xl font-bold">
              {interview.questionCount}
            </p>
            <p className="text-sm text-gray-500">
              Questions
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xl font-bold">
              {interview.codingQuestionCount}
            </p>
            <p className="text-sm text-gray-500">
              Coding
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xl font-bold">
              {interview.oralQuestionCount}
            </p>
            <p className="text-sm text-gray-500">
              Oral
            </p>
          </div>

        </div>

        <button
          onClick={() =>
            navigate(
              `/interview/${interviewId}`
            )
          }
          className="mt-8 w-full rounded-lg bg-black px-6 py-3 font-medium text-white"
        >
          Start Interview
        </button>

      </div>
    </div>
  );
};

export default InterviewPreparing;