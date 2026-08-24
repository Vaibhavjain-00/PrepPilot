import { useState } from "react";
import { useNavigate } from "react-router-dom";

import interviewService from "../services/interview.service";

const InterviewSetup = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [difficulty, setDifficulty] =
    useState("medium");

  const [questionCount, setQuestionCount] =
    useState(5);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role.trim()) {
      setError("Please enter your target role");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await interviewService.generateInterview({
          role: role.trim(),
          company: company.trim(),
          difficulty,
          questionCount,
        });

      const interview =
        response.data.interview;

      const interviewId = data.interviewId;

      navigate(
        `/interview/${interviewId}/preparing`
      );
    } catch (error) {
      console.error(
        "Interview generation failed:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to generate interview"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Create Mock Interview
          </h1>

          <p className="mt-2 text-gray-500">
            Configure your interview and start
            practicing.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow"
        >

          {/* Role */}

          <div className="mb-5">
            <label className="mb-2 block font-medium">
              Target Role
            </label>

            <input
              type="text"
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              placeholder="Backend Developer"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* Company */}

          <div className="mb-5">
            <label className="mb-2 block font-medium">
              Company
              <span className="ml-1 text-gray-400">
                (Optional)
              </span>
            </label>

            <input
              type="text"
              value={company}
              onChange={(e) =>
                setCompany(e.target.value)
              }
              placeholder="Google"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* Difficulty */}

          <div className="mb-5">
            <label className="mb-2 block font-medium">
              Difficulty
            </label>

            <div className="grid grid-cols-3 gap-3">

              {["easy", "medium", "hard"].map(
                (level) => (
                  <button
                    type="button"
                    key={level}
                    onClick={() =>
                      setDifficulty(level)
                    }
                    className={`rounded-lg border px-4 py-3 capitalize ${
                      difficulty === level
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {level}
                  </button>
                )
              )}

            </div>
          </div>

          {/* Question Count */}

          <div className="mb-6">
            <label className="mb-2 block font-medium">
              Number of Questions
            </label>

            <div className="grid grid-cols-3 gap-3">

              {[5, 10, 15].map((count) => (
                <button
                  type="button"
                  key={count}
                  onClick={() =>
                    setQuestionCount(count)
                  }
                  className={`rounded-lg border px-4 py-3 ${
                    questionCount === count
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {count}
                </button>
              ))}

            </div>

            <p className="mt-2 text-sm text-gray-500">
              {questionCount === 5 &&
                "1 coding + 4 oral questions"}

              {questionCount === 10 &&
                "2 coding + 8 oral questions"}

              {questionCount === 15 &&
                "3 coding + 12 oral questions"}
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Preparing Interview..."
              : "Generate Interview"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default InterviewSetup;