import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import interviewService from "../services/interview.service";

const Evaluation = () => {
  const { interviewId } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const isEvaluating =
    location.pathname.endsWith("/evaluating");

  const [evaluation, setEvaluation] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // useEffect(() => {
  //   let interval;

  //   const checkEvaluation = async () => {
  //     try {
  //       const response =
  //         await interviewService.getInterviewEvaluation(
  //           interviewId
  //         );

  //       console.log(
  //         "EVALUATION RESPONSE:",
  //         response
  //       );

  //       const data = response.data;

  //       if (data) {
  //         setEvaluation(data);

  //         // Evaluation mil gayi
  //         if (isEvaluating) {
  //           navigate(
  //             `/interview/${interviewId}/result`,
  //             {
  //               replace: true,
  //             }
  //           );
  //         }

  //         if (interval) {
  //           clearInterval(interval);
  //         }
  //       }
  //     } catch (error) {
  //       console.log(
  //         "Evaluation not ready yet..."
  //       );

  //       // Evaluation abhi backend mein chal rahi hai
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   checkEvaluation();

  //   /*
  //     Sirf evaluating page par polling chalegi.
  //     Result page par polling ki zarurat nahi.
  //   */

  //   if (isEvaluating) {
  //     interval = setInterval(
  //       checkEvaluation,
  //       2000
  //     );
  //   }

  //   return () => {
  //     if (interval) {
  //       clearInterval(interval);
  //     }
  //   };
  // }, [interviewId, isEvaluating, navigate]);

  useEffect(() => {
  let interval;
  let isMounted = true;

  const checkEvaluation = async () => {
    try {
      const response =
        await interviewService.getInterviewEvaluation(
          interviewId
        );

      console.log(
        "EVALUATION RESPONSE:",
        response
      );

      const data = response.data;

      if (!isMounted) return;

      if (data) {
        setEvaluation(data);
        setLoading(false);

        if (interval) {
          clearInterval(interval);
          interval = null;
        }

        if (isEvaluating) {
          navigate(
            `/interview/${interviewId}/result`,
            {
              replace: true,
            }
          );
        }
      }
    } catch (error) {
      /*
        Evaluation not available yet.

        404 ka matlab:
        Worker abhi evaluation bana raha hai.
      */

      if (
        error.response?.status === 404
      ) {
        console.log(
          "Evaluation not ready yet..."
        );

        return;
      }

      console.error(
        "Failed to fetch evaluation:",
        error
      );

      if (isMounted) {
        setError(
          "Failed to load interview evaluation."
        );
        setLoading(false);
      }
    }
  };

  checkEvaluation();

  if (isEvaluating) {
    interval = setInterval(
      checkEvaluation,
      3000
    );
  }

  return () => {
    isMounted = false;

    if (interval) {
      clearInterval(interval);
    }
  };
}, [
  interviewId,
  isEvaluating,
  navigate,
]);


  if (isEvaluating && !evaluation) {
    return (
      <div className="min-h-screen bg-gray-50 px-4">
        <div className="flex min-h-screen items-center justify-center">

          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

            {/* Spinner */}

            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-gray-200 border-t-black animate-spin">
            </div>

            <h1 className="text-2xl font-bold">
              Evaluating Your Interview
            </h1>

            <p className="mt-3 leading-6 text-gray-500">
              Our AI is analyzing your answers,
              technical understanding and overall
              performance.
            </p>

            <p className="mt-4 text-sm text-gray-400">
              This may take a few moments...
            </p>

          </div>

        </div>
      </div>
    );
  }

  

  if (loading && !evaluation) {
    return (
      <div className="flex min-h-screen items-center justify-center">

        <p className="text-lg font-medium">
          Loading evaluation...
        </p>

      </div>
    );
  }



  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">

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

  if (!evaluation) {
    return (
      <div className="flex min-h-screen items-center justify-center">

        <p>
          No evaluation available.
        </p>

      </div>
    );
  }

  

  const score =
    evaluation.overallScore ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">

      <div className="mx-auto max-w-5xl">

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              Interview Evaluation
            </h1>

            <p className="mt-1 text-gray-500">
              Your AI-powered interview feedback
            </p>

          </div>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium hover:bg-gray-100"
          >
            Dashboard
          </button>

        </div>

        {/* Overall Score */}

        <div className="mb-6 rounded-2xl bg-white p-8 shadow-sm">

          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">

            <div>

              <h2 className="text-xl font-semibold">
                Overall Score
              </h2>

              <p className="mt-2 text-gray-500">
                Based on your performance across
                all interview questions.
              </p>

            </div>

            <div className="flex h-32 w-32 items-center justify-center rounded-full border-8 border-black">

              <div className="text-center">

                <p className="text-3xl font-bold">
                  {score}
                </p>

                <p className="text-sm text-gray-500">
                  / 100
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Overall Feedback */}

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="mb-3 text-xl font-semibold">
            Overall Feedback
          </h2>

          <p className="leading-7 text-gray-700">
            {evaluation.overallFeedback ||
              "No overall feedback available."}
          </p>

        </div>

        {/* Question Feedback */}

        <div>

          <h2 className="mb-4 text-2xl font-bold">
            Question-wise Feedback
          </h2>

          <div className="space-y-5">

            {evaluation.questions?.map(
              (item, index) => (

                <div
                  key={
                    item.questionId ||
                    index
                  }
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >

                  {/* Question Header */}

                  <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                    <div className="flex items-center gap-3">

                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                        {index + 1}
                      </span>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-sm capitalize">
                        {item.category}
                      </span>

                    </div>

                    <div className="text-lg font-bold">
                      {item.score}/10
                    </div>

                  </div>

                  {/* Question */}

                  <div className="mb-5">

                    <p className="font-semibold text-gray-900">
                      {item.question}
                    </p>

                  </div>

                  {/* Candidate Answer */}

                  <div className="mb-5">

                    <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">
                      Your Answer
                    </h3>

                    <div className="rounded-lg bg-gray-50 p-4">

                      <p className="whitespace-pre-wrap text-gray-700">
                        {item.candidateAnswer ||
                          "No answer provided."}
                      </p>

                    </div>

                  </div>

                  {/* AI Feedback */}

                  <div>

                    <h3 className="mb-2 text-sm font-semibold uppercase text-gray-500">
                      AI Feedback
                    </h3>

                    <div className="rounded-lg border border-gray-200 p-4">

                      <p className="leading-6 text-gray-700">
                        {item.feedback ||
                          "No feedback available."}
                      </p>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        </div>


        <div className="mt-8 flex justify-center">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="rounded-lg bg-black px-8 py-3 font-medium text-white hover:bg-gray-800"
          >
            Back to Dashboard
          </button>

        </div>

      </div>

    </div>
  );
};

export default Evaluation;