import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle2,
  FileText,
  History,
  Mic,
  Play,
  Plus,
  Target,
  TrendingUp,
  UserRound,
  XCircle,
} from "lucide-react";

import dashboardService from "../services/dashboard.service.js";

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await dashboardService.getDashboard();

      console.log("DASHBOARD RESPONSE:", response);

      setDashboard(response.data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);

      setError(error.response?.data?.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 rounded-2xl bg-gray-200" />

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="h-28 rounded-xl bg-gray-200" />
              <div className="h-28 rounded-xl bg-gray-200" />
              <div className="h-28 rounded-xl bg-gray-200" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="h-72 rounded-xl bg-gray-200 lg:col-span-2" />
              <div className="h-72 rounded-xl bg-gray-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <XCircle className="h-6 w-6 text-red-500" />
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-gray-500">{error}</p>

          <button
            onClick={fetchDashboard}
            className="mt-6 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const user = dashboard?.user || {};

  const interviews = dashboard?.interviews || {
    total: 0,
    averageScore: 0,
    bestScore: 0,
  };

  const activeInterview = dashboard?.activeInterview;

  const recentInterviews = dashboard?.recentInterviews || [];
  const firstName = user?.fullname?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* =========================================
            HEADER / WELCOME
        ========================================= */}

        <section className="rounded-2xl bg-black p-6 text-white shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-gray-400">Welcome back</p>

              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                Hi, {firstName} 👋
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-300 sm:text-base">
                Keep preparing, keep improving, and get one step closer to your
                dream job.
              </p>
            </div>

            <button
              onClick={() => navigate("/interview/setup")}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-100"
            >
              <Plus className="h-4 w-4" />
              Start Mock Interview
            </button>
          </div>
        </section>

        {/* =========================================
            QUICK STATS
        ========================================= */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Briefcase}
            title="Total Interviews"
            value={interviews.total}
            description="Completed interviews"
          />

          <StatCard
            icon={Target}
            title="Average Score"
            value={`${interviews.averageScore}%`}
            description="Across your interviews"
          />

          <StatCard
            icon={TrendingUp}
            title="Best Score"
            value={`${interviews.bestScore}%`}
            description="Your highest score"
          />

          <StatCard
            icon={BarChart3}
            title="Practice"
            value={interviews.total > 0 ? "Active" : "Start"}
            description={
              interviews.total > 0 ? "Keep improving" : "Your first interview"
            }
          />
        </section>

        {/* =========================================
            MAIN CONTENT
        ========================================= */}

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* LEFT */}
          <div className="space-y-6 lg:col-span-2">
            {/* ACTIVE INTERVIEW */}

            {activeInterview ? (
              <ActiveInterviewCard
                interview={activeInterview}
                onContinue={() => navigate(`/interview/${activeInterview._id}`)}
              />
            ) : (
              <StartInterviewCard
                onStart={() => navigate("/interview/setup")}
              />
            )}

            {/* RECENT INTERVIEWS */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Interviews
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Your latest interview performance
                  </p>
                </div>

                <Link
                  to="/interview/history"
                  className="hidden items-center gap-1 text-sm font-medium text-gray-700 hover:text-black sm:flex"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {recentInterviews.length === 0 ? (
                <EmptyInterviews />
              ) : (
                <div className="mt-5 divide-y divide-gray-100">
                  {recentInterviews.map((interview) => (
                    <RecentInterview
                      key={interview.evaluationId}
                      interview={interview}
                      onClick={() =>
                        navigate(`/interview/${interview.interviewId}/result`)
                      }
                    />
                  ))}
                </div>
              )}

              <Link
                to="/interview/history"
                className="mt-4 flex items-center justify-center gap-1 border-t border-gray-100 pt-4 text-sm font-medium text-gray-700 hover:text-black sm:hidden"
              >
                View all interviews
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            {/* =========================================
                PROFILE & PREPARATION
            ========================================= */}

            <section className="mt-6 grid gap-6 md:grid-cols-3">
              {/* Profile */}

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <UserRound className="h-5 w-5 text-gray-700" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Profile</h3>

                    <p className="text-sm text-gray-500">
                      Keep your profile updated
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Profile</span>

                    <span className="font-medium text-gray-900">
                      {user?.name ? "Complete" : "Incomplete"}
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-black"
                      style={{
                        width: user?.name ? "100%" : "30%",
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => navigate("/profile")}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  View Profile
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Resume */}

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <FileText className="h-5 w-5 text-gray-700" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Resume</h3>

                    <p className="text-sm text-gray-500">Manage your resume</p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center gap-2">
                    {user?.resume ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 text-green-600" />

                        <span className="text-sm font-medium text-green-700">
                          Resume uploaded
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-gray-400" />

                        <span className="text-sm font-medium text-gray-600">
                          Resume not uploaded
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => navigate("/profile")}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Manage Resume
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Skills */}

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <BookOpen className="h-5 w-5 text-gray-700" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">Skills</h3>

                    <p className="text-sm text-gray-500">
                      Your technical skills
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {user?.skills?.length > 0 ? (
                    user.skills.slice(0, 4).map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                      >
                        {typeof skill === "string" ? skill : skill.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No skills added yet.
                    </p>
                  )}
                </div>

                <button
                  onClick={() => navigate("/resume")}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Manage Skills
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </section>
          </div>

          {/* RIGHT */}

          <div className="space-y-6">
            {/* QUICK ACTIONS */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Continue your preparation
              </p>

              <div className="mt-5 space-y-3">
                <QuickAction
                  icon={Mic}
                  title="Mock Interview"
                  description="Practice with AI"
                  onClick={() => navigate("/interview/setup")}
                />

                <QuickAction
                  icon={History}
                  title="Interview History"
                  description="View past interviews"
                  onClick={() => navigate("/interview/history")}
                />

                <QuickAction
                  icon={FileText}
                  title="My Resume"
                  description="Manage your resume"
                  onClick={() => navigate("/resume")}
                />

                <QuickAction
                  icon={UserRound}
                  title="My Profile"
                  description="Update your profile"
                  onClick={() => navigate("/profile")}
                />
              </div>
            </section>

            {/* PREPARATION CARD */}

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <BookOpen className="h-5 w-5 text-gray-700" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Keep Preparing
                  </h2>

                  <p className="text-sm text-gray-500">Consistency is key</p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <p className="text-sm leading-6 text-gray-600">
                  Practice regularly and review your previous AI feedback to
                  improve your interview performance.
                </p>
              </div>

              <button
                onClick={() => navigate("/interview/history")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Review Feedback
                <ArrowRight className="h-4 w-4" />
              </button>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
};

/* =====================================================
   STAT CARD
===================================================== */

const StatCard = ({ icon: Icon, title, value, description }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>

          <p className="mt-1 text-xs text-gray-400">{description}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
          <Icon className="h-5 w-5 text-gray-700" />
        </div>
      </div>
    </div>
  );
};

/* =====================================================
   ACTIVE INTERVIEW
===================================================== */

const ActiveInterviewCard = ({ interview, onContinue }) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500" />

        <span className="text-sm font-medium text-green-600">
          Interview in progress
        </span>
      </div>

      <div className="mt-4 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold capitalize text-gray-900">
            {interview.role}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {interview.company || "Mock Interview"}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>{interview.difficulty}</Badge>

            <Badge>{interview.questionCount} Questions</Badge>

            {interview.codingQuestionCount > 0 && (
              <Badge>{interview.codingQuestionCount} Coding</Badge>
            )}

            {interview.oralQuestionCount > 0 && (
              <Badge>{interview.oralQuestionCount} Oral</Badge>
            )}
          </div>
        </div>

        <button
          onClick={onContinue}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Continue Interview
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};

/* =====================================================
   START INTERVIEW
===================================================== */

const StartInterviewCard = ({ onStart }) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
          <Play className="h-6 w-6 text-gray-800" />
        </div>

        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          Ready for your next interview?
        </h2>

        <p className="mt-2 max-w-lg text-sm leading-6 text-gray-500">
          Practice coding and technical questions with an AI-powered mock
          interview.
        </p>

        <button
          onClick={onStart}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          Start Mock Interview
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};

/* =====================================================
   RECENT INTERVIEW
===================================================== */

const RecentInterview = ({ interview, onClick }) => {
  const score = interview.score ?? 0;

  const scoreText =
    score >= 80
      ? "text-green-600"
      : score >= 60
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 py-4 text-left transition hover:bg-gray-50"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 sm:flex">
          <Briefcase className="h-5 w-5 text-gray-600" />
        </div>

        <div className="min-w-0">
          <p className="truncate font-medium capitalize text-gray-900">
            {interview.role}
          </p>

          <p className="mt-1 truncate text-sm text-gray-500">
            {interview.company || "Mock Interview"} •{" "}
            <span className="capitalize">{interview.difficulty}</span>
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="text-right">
          <p className={`font-semibold ${scoreText}`}>{score}/100</p>

          <p className="text-xs text-gray-400">Score</p>
        </div>

        <ArrowRight className="hidden h-4 w-4 text-gray-400 sm:block" />
      </div>
    </button>
  );
};

/* =====================================================
   QUICK ACTION
===================================================== */

const QuickAction = ({ icon: Icon, title, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-3 text-left transition hover:border-gray-300 hover:bg-gray-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
        <Icon className="h-5 w-5 text-gray-700" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>

        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      </div>

      <ArrowRight className="h-4 w-4 text-gray-400" />
    </button>
  );
};

/* =====================================================
   BADGE
===================================================== */

const Badge = ({ children }) => {
  return (
    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600">
      {children}
    </span>
  );
};

/* =====================================================
   EMPTY INTERVIEWS
===================================================== */

const EmptyInterviews = () => {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-gray-300 p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <History className="h-5 w-5 text-gray-500" />
      </div>

      <h3 className="mt-3 font-medium text-gray-900">No interviews yet</h3>

      <p className="mt-1 text-sm text-gray-500">
        Complete your first mock interview and your results will appear here.
      </p>
    </div>
  );
};

export default Dashboard;
