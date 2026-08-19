import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";

import interviewService from "../services/interview.service";

import {
  setActiveInterview,
  setCurrentInterviewQuestion,
  nextInterviewQuestion,
  finishInterview,
} from "../store/interviewSlice";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

const LANGUAGES = [
  {
    label: "C++",
    value: "cpp",
  },
  {
    label: "Java",
    value: "java",
  },
  {
    label: "JavaScript",
    value: "javascript",
  },
  {
    label: "Python",
    value: "python",
  },
];

const Interview = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // -----------------------------------------
  // INTERVIEW STATE
  // -----------------------------------------

  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] =
    useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // -----------------------------------------
  // ANSWER STATE
  // -----------------------------------------

  const [answer, setAnswer] = useState("");

  // Coding
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");

  // -----------------------------------------
  // SPEECH TO TEXT
  // -----------------------------------------

  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  // -----------------------------------------
  // UI STATE
  // -----------------------------------------

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------------------
  // SOCKET
  // -----------------------------------------

  const socketRef = useRef(null);

  // -----------------------------------------
  // FETCH INTERVIEW
  // -----------------------------------------

  useEffect(() => {
    if (!interviewId) return;

    fetchInterview();
  }, [interviewId]);

  // -----------------------------------------
  // SOCKET CONNECTION
  // -----------------------------------------

  useEffect(() => {
    if (!interviewId) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(
        "Socket connected:",
        socket.id
      );

      console.log(
        "Joining interview room:",
        interviewId
      );

      socket.emit(
        "join-interview",
        interviewId
      );
    });

    socket.on("connect_error", (error) => {
      console.error(
        "Socket connection error:",
        error
      );
    });

    socket.on("disconnect", (reason) => {
      console.log(
        "Socket disconnected:",
        socket.id,
        reason
      );
    });

    return () => {
      socket.emit(
        "leave-interview",
        interviewId
      );

      socket.disconnect();

      socketRef.current = null;
    };
  }, [interviewId]);

  // -----------------------------------------
  // FETCH INTERVIEW FUNCTION
  // -----------------------------------------

  const fetchInterview = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await interviewService.getInterview(
          interviewId
        );

      console.log(
        "GET INTERVIEW RESPONSE:",
        response
      );

      const data = response.data;

      console.log(
        "INTERVIEW DATA:",
        data
      );

      const interviewData = data.interview;

      // ---------------------------------------
      // IMPORTANT
      // ---------------------------------------
      // Backend currently returns populated
      // interview.questions.
      //
      // So if currentQuestion is not returned,
      // we can get it from questions array.

      let questionData =
        data.currentQuestion;

      let questionIndex =
        data.currentQuestionIndex ?? 0;

      if (
        !questionData &&
        interviewData?.questions?.length
      ) {
        questionData =
          interviewData.questions[
            questionIndex
          ];
      }

      // ---------------------------------------
      // SET STATE
      // ---------------------------------------

      setInterview(interviewData);
      setCurrentQuestion(questionData);
      setCurrentIndex(questionIndex);

      // ---------------------------------------
      // SET ANSWER
      // ---------------------------------------

      if (
        questionData?.category === "coding"
      ) {
        setCode(
          questionData.candidateAnswer || ""
        );

        setAnswer("");
      } else {
        setAnswer(
          questionData?.candidateAnswer || ""
        );

        setCode("");
      }

      // ---------------------------------------
      // REDUX
      // ---------------------------------------

      dispatch(
        setActiveInterview(interviewData)
      );

      if (questionData) {
        dispatch(
          setCurrentInterviewQuestion({
            question: questionData,
            index: questionIndex,
          })
        );
      }
    } catch (error) {
      console.error(
        "Failed to fetch interview:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load interview"
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // SPEECH TO TEXT
  // -----------------------------------------

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Speech recognition is not supported in this browser. Please use Google Chrome."
      );

      return;
    }

    if (isListening) {
      return;
    }

    setError("");

    const recognition =
      new SpeechRecognition();

    recognitionRef.current = recognition;

    // English only
    recognition.lang = "en-US";

    // Keep listening until user presses stop
    recognition.continuous = true;

    // We don't need interim text because
    // we don't want text appearing on screen.
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log(
        "Speech recognition started"
      );

      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let spokenText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        if (
          event.results[i].isFinal
        ) {
          spokenText +=
            event.results[i][0]
              .transcript;
        }
      }

      if (!spokenText.trim()) {
        return;
      }

      console.log(
        "Speech converted successfully"
      );

      // ---------------------------------------
      // IMPORTANT:
      //
      // Text is stored internally in `answer`
      // but we don't render it separately.
      // ---------------------------------------

      setAnswer((previous) => {
        const newText =
          `${previous} ${spokenText}`.trim();

        return newText;
      });
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsListening(false);

      if (
        event.error ===
        "not-allowed"
      ) {
        setError(
          "Microphone permission was denied. Please allow microphone access."
        );
      } else if (
        event.error !== "aborted"
      ) {
        setError(
          "Could not recognize your voice. Please try again."
        );
      }
    };

    recognition.onend = () => {
      console.log(
        "Speech recognition ended"
      );

      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "Failed to start speech recognition:",
        error
      );

      setIsListening(false);
    }
  };

  // -----------------------------------------
  // STOP SPEECH RECOGNITION
  // -----------------------------------------

  const stopSpeechRecognition = () => {
    if (!recognitionRef.current) {
      return;
    }

    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error(
        "Failed to stop speech recognition:",
        error
      );
    }

    setIsListening(false);
  };

  // -----------------------------------------
  // CLEAN SPEECH RECOGNITION
  // -----------------------------------------

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error(error);
        }
      }
    };
  }, []);

  // -----------------------------------------
  // RESET ANSWER
  // -----------------------------------------

  const resetAnswerState = (
    question
  ) => {
    setError("");

    setIsListening(false);

    // Stop previous recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error(error);
      }

      recognitionRef.current = null;
    }

    if (
      question?.category === "coding"
    ) {
      setCode(
        question.candidateAnswer || ""
      );

      setAnswer("");
      setLanguage("cpp");
    } else {
      setAnswer(
        question?.candidateAnswer || ""
      );

      setCode("");
    }
  };

  // -----------------------------------------
  // SUBMIT ANSWER
  // -----------------------------------------

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) {
      return;
    }

    // ---------------------------------------
    // STOP SPEECH BEFORE SUBMIT
    // ---------------------------------------

    if (isListening) {
      stopSpeechRecognition();
    }

    const isCoding =
      currentQuestion.category ===
      "coding";

    const finalAnswer = isCoding
      ? code
      : answer;

    if (!finalAnswer.trim()) {
      setError(
        isCoding
          ? "Please write your code before submitting."
          : "Please provide an answer before submitting."
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      console.log(
        "Submitting answer for question:",
        currentQuestion._id
      );

      const response =
        await interviewService.submitAnswer(
          interviewId,
          currentQuestion._id,
          finalAnswer
        );

      console.log(
        "SUBMIT ANSWER RESPONSE:",
        response
      );

      const data = response.data;


      if (data.isLastQuestion) {
        console.log(
          "Interview completed. Going to evaluation."
        );
        const response=await interviewService.evaluateInterview(interviewId);
        navigate(
          `/interview/${interviewId}/evaluating`
        );

        return;
      }


      const nextQuestion =
        data.nextQuestion;

      const nextIndex =
        data.currentQuestionIndex;

      if (!nextQuestion) {
        setError(
          "Next question is not available."
        );

        return;
      }

      console.log(
        "NEXT QUESTION:",
        nextQuestion
      );

      setCurrentQuestion(
        nextQuestion
      );

      setCurrentIndex(nextIndex);

      resetAnswerState(
        nextQuestion
      );

  

      dispatch(
        nextInterviewQuestion({
          question: nextQuestion,
          index: nextIndex,
        })
      );
    } catch (error) {
      console.error(
        "Failed to submit answer:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to submit answer"
      );
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-semibold">
            Loading interview...
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Please wait
          </p>
        </div>
      </div>
    );
  }

 
  if (
    error &&
    !currentQuestion
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500">
            {error}
          </p>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="mt-4 rounded-lg bg-black px-5 py-2.5 text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-semibold">
            No question available.
          </p>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="mt-4 rounded-lg bg-black px-5 py-2.5 text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }


  const totalQuestions =
    interview?.questionCount || 0;

  const progress =
    totalQuestions > 0
      ? ((currentIndex + 1) /
          totalQuestions) *
        100
      : 0;

  const isCoding =
    currentQuestion.category ===
    "coding";

  const isLastQuestion =
    currentIndex + 1 ===
    totalQuestions;


  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">


        <div className="mb-6 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Mock Interview
            </h1>

            <p className="mt-1 text-gray-500">
              {interview?.role}

              {interview?.company &&
                ` • ${interview.company}`}
            </p>
          </div>

          <div className="text-sm font-semibold text-gray-700">
            Question{" "}
            {currentIndex + 1}{" "}
            / {totalQuestions}
          </div>
        </div>


        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-black transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

      

        <div className="rounded-xl bg-white p-6 shadow-sm">

          <div className="mb-4 flex items-center justify-between">

            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                isCoding
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {isCoding
                ? "Coding"
                : "Technical"}
            </span>

            <span className="text-sm capitalize text-gray-500">
              {interview?.difficulty}
            </span>
          </div>

          <h2 className="text-xl font-semibold leading-relaxed text-gray-900">
            {currentQuestion.question}
          </h2>
        </div>

     
        {isCoding && (
          <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">

            {/* Editor Header */}

            <div className="flex flex-col gap-4 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="font-semibold text-gray-900">
                  Write your solution
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Select your preferred programming language.
                </p>
              </div>

              {/* Language */}

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(
                    e.target.value
                  )
                }
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-black"
              >
                {LANGUAGES.map(
                  (item) => (
                    <option
                      key={
                        item.value
                      }
                      value={
                        item.value
                      }
                    >
                      {item.label}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Monaco */}

            <Editor
              height="500px"
              language={language}
              value={code}
              onChange={(value) =>
                setCode(value || "")
              }
              theme="vs-dark"
              options={{
                minimap: {
                  enabled: false,
                },

                fontSize: 15,

                automaticLayout: true,

                wordWrap: "on",

                scrollBeyondLastLine: false,

                padding: {
                  top: 16,
                },
              }}
            />
          </div>
        )}


        {!isCoding && (
          <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

            <div className="mb-4">
              <label className="block font-semibold text-gray-900">
                Your Answer
              </label>

              <p className="mt-1 text-sm text-gray-500">
                Type your answer or answer using your voice.
              </p>
            </div>

            <textarea
              value={answer}
              onChange={(e) =>
                setAnswer(
                  e.target.value
                )
              }
              placeholder="Type your answer here..."
              rows={8}
              className="w-full resize-none rounded-lg border border-gray-300 p-4 text-gray-900 outline-none transition focus:border-black"
            />

            <div className="mt-5 border-t border-gray-200 pt-5">

              <p className="mb-3 text-sm font-medium text-gray-700">
                Or answer with voice
              </p>

              {!isListening ? (
                <button
                  type="button"
                  onClick={
                    startSpeechRecognition
                  }
                  className="rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800"
                >
                  🎙 Answer with Voice
                </button>
              ) : (
                <button
                  type="button"
                  onClick={
                    stopSpeechRecognition
                  }
                  className="rounded-lg bg-red-600 px-5 py-3 font-medium text-white transition hover:bg-red-700"
                >
                  ⏹ Stop Speaking
                </button>
              )}

              {isListening && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

                  Listening...
                </div>
              )}

              <p className="mt-2 text-xs text-gray-400">
                Your voice will be converted to text. Audio is not stored.
              </p>
            </div>
          </div>
        )}

       

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}


        <div className="mt-6 flex justify-end">

          <button
            type="button"
            onClick={
              handleSubmitAnswer
            }
            disabled={
              submitting ||
              (isCoding
                ? !code.trim()
                : !answer.trim())
            }
            className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Submitting..."
              : isLastQuestion
                ? "Finish Interview"
                : "Submit Answer"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Interview;