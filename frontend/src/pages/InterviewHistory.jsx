import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import interviewService from "../services/interview.service";

const InterviewHistory = () => {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await interviewService.getInterviewHistory();

      console.log(
        "INTERVIEW HISTORY:",
        response
      );

      setInterviews(response.data || []);
    } catch (error) {
      console.error(
        "Failed to fetch interview history:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load interview history"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium">
          Loading interview history...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Interview History
            </h1>

            <p className="mt-1 text-gray-500">
              Review your previous mock interviews
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium hover:bg-gray-100"
          >
            Dashboard
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!error && interviews.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold">
              No interviews yet
            </h2>

            <p className="mt-2 text-gray-500">
              Complete your first mock interview to
              see it here.
            </p>

            <button
              onClick={() =>
                navigate("/interview/setup")
              }
              className="mt-5 rounded-lg bg-black px-5 py-2 text-white"
            >
              Start Interview
            </button>
          </div>
        )}

        {/* Interview List */}
        <div className="space-y-4">
          {interviews.map((evaluation) => {
            const interview =
              evaluation.interviewId;

            if (!interview) {
              return null;
            }

            return (
              <div
                key={evaluation._id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

                  {/* Interview Info */}
                  <div>
                    <h2 className="text-xl font-semibold capitalize">
                      {interview.role}
                    </h2>

                    <p className="mt-1 text-gray-500">
                      {interview.company ||
                        "Company not specified"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm capitalize">
                        {interview.difficulty}
                      </span>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                        {interview.questionCount} Questions
                      </span>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                        {interview.codingQuestionCount} Coding
                      </span>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                        {interview.oralQuestionCount} Oral
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-gray-400">
                      {new Date(
                        evaluation.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Score + Button */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold">
                        {evaluation.overallScore}
                      </p>

                      <p className="text-sm text-gray-500">
                        / 100
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/interview/${interview._id}/result`
                        )
                      }
                      className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
                    >
                      View Result
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default InterviewHistory;