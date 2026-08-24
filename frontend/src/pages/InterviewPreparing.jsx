import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import interviewService from "../services/interview.service";

const InterviewPreparing = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let interval;

    const fetchInterview = async () => {
      try {
        const response =
          await interviewService.getInterview(interviewId);

        const data = response.data;

        const interviewData =
          data.interview;

        setInterview(interviewData);

        /*
         * Interview generation completed
         */
        if (interviewData.status === "ready") {
          clearInterval(interval);

          setLoading(false);

          return;
        }

        /*
         * Interview generation failed
         */
        if (interviewData.status === "failed") {
          clearInterval(interval);

          setError(
            "Failed to generate interview. Please try again."
          );

          setLoading(false);

          return;
        }

        /*
         * Still generating
         */
        setLoading(false);

      } catch (error) {
        console.error(
          "Unable to fetch interview:",
          error
        );

        /*
         * Don't immediately show error while
         * interview is being generated.
         */

        if (!interview) {
          setError(
            error.response?.data?.message ||
              "Unable to load interview"
          );

          setLoading(false);
        }
      }
    };

    /*
     * First request immediately
     */
    fetchInterview();

    /*
     * Keep checking every 2 seconds
     */
    interval = setInterval(() => {
      fetchInterview();
    }, 2000);

    /*
     * Cleanup
     */
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [interviewId]);

  /*
   * Initial loading
   */
  if (loading && !interview) {
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

  /*
   * Error
   */
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

  /*
   * Interview is still generating
   */
  if (
    interview &&
    interview.status !== "ready"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">

        <div className="w-full max-w-xl rounded-2xl bg-white p-8 text-center shadow">

          <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <h1 className="text-2xl font-bold">
            Preparing Your Interview
          </h1>

          <p className="mt-3 text-gray-500">
            Our AI is generating personalized
            questions based on your resume.
          </p>

          <p className="mt-4 text-sm text-gray-400">
            This may take a few moments...
          </p>

          <div className="mt-6 rounded-lg bg-gray-50 p-4">

            <p className="font-medium">
              {interview.role}
              {interview.company &&
                ` • ${interview.company}`}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {interview.questionCount} questions
            </p>

          </div>

        </div>
      </div>
    );
  }

  /*
   * Interview ready
   */
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
        onClick={async () => {
          try {
            await interviewService.startInterview(interviewId);

            navigate(`/interview/${interviewId}`);
          } catch (error) {
            console.error(
              "Failed to start interview:",
              error
            );

            setError(
              error.response?.data?.message ||
                "Failed to start interview"
            );
          }
        }}
        className="mt-8 w-full rounded-lg bg-black px-6 py-3 font-medium text-white"
      >
        Start Interview
      </button>

      </div>
    </div>
  );
};

export default InterviewPreparing;