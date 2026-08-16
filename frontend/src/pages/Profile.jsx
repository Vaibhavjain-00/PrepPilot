import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Shield,
  FileText,
  Upload,
  Trash2,
  ExternalLink,
  Briefcase,
} from "lucide-react";

import { useSelector } from "react-redux";

import resumeService from "../services/resume.service";
import ActiveInterviewBar from "./ActiveInterviewBar";

function Profile() {
  const { userData } = useSelector((state) => state.auth);

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const response = await resumeService.getResume();

      setResume(response.data);
    } catch (error) {
      setResume(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your resume?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await resumeService.deleteResume();

      setResume(null);
    } catch (error) {
      console.error("Resume deletion failed:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to delete resume"
      );
    } finally {
      setDeleting(false);
    }
  };

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Loading profile...
        </p>
      </div>
    );
  }
console.log("UserData:-",userData)
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">

        {/* PAGE HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="mt-1 text-gray-500">
            Manage your profile, resume and skills.
          </p>
        </div>


        {/* PROFILE CARD */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

            {/* AVATAR */}

            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">

              {userData.avatar ? (
                <img
                  src={userData.avatar}
                  alt={userData.fullname}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User
                  size={42}
                  className="text-gray-400"
                />
              )}

            </div>


            {/* USER INFO */}

            <div className="flex-1">

              <h2 className="text-2xl font-semibold text-gray-900">
                {userData.data.fullname}
              </h2>

              <div className="mt-3 space-y-2">

                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={17} />

                  <span>
                    {userData.data.email}
                  </span>
                </div>


                <div className="flex items-center gap-2 text-gray-600">
                  <Shield size={17} />

                  <span className="capitalize">
                    {userData.data.role}
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* RESUME SECTION */}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Resume
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your current resume
              </p>
            </div>

            <FileText
              size={24}
              className="text-gray-400"
            />

          </div>


          {loading ? (

            <div className="py-8 text-center text-gray-500">
              Loading resume...
            </div>

          ) : resume ? (

            <div>

              {/* RESUME INFO */}

              <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white shadow-sm">

                    <FileText
                      size={22}
                      className="text-gray-600"
                    />

                  </div>

                  <div>

                    <p className="font-medium text-gray-900">
                      Resume
                    </p>

                    <p className="text-sm text-gray-500">
                      {resume.status === "parsed"
                        ? "Resume parsed successfully"
                        : "Resume uploaded"}
                    </p>

                  </div>

                </div>


                {/* RESUME ACTIONS */}

                <div className="flex flex-wrap gap-2">

                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <ExternalLink size={16} />
                    View
                  </a>


                  <Link
                    to="/resume"
                    className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    <Upload size={16} />
                    Replace
                  </Link>


                  <button
                    onClick={handleDeleteResume}
                    disabled={deleting}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={16} />

                    {deleting
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </div>


              {/* RESUME STATUS */}

              <div className="mt-4 flex items-center gap-2 text-sm">

                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    resume.status === "parsed"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  }`}
                />

                <span className="capitalize text-gray-600">
                  {resume.status}
                </span>

              </div>

            </div>

          ) : (

            /* NO RESUME */

            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">

              <FileText
                size={40}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-4 font-medium text-gray-900">
                No resume uploaded
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Upload your resume to analyze your skills and profile.
              </p>

              <Link
                to="/resume"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
              >
                <Upload size={17} />
                Upload Resume
              </Link>

            </div>

          )}

        </div>


        {/* SKILLS SECTION */}

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">

              <Briefcase
                size={20}
                className="text-gray-600"
              />

            </div>

            <div>

              <h2 className="text-xl font-semibold text-gray-900">
                Skills
              </h2>

              <p className="text-sm text-gray-500">
                Skills extracted from your resume
              </p>

            </div>

          </div>


          {resume?.skills?.length > 0 ? (

            <div className="flex flex-wrap gap-2">

              {resume.skills.map((skill, index) => (

                <span
                  key={`${skill}-${index}`}
                  className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700"
                >
                  {skill}
                </span>

              ))}

            </div>

          ) : (

            <p className="text-sm text-gray-500">
              No skills available. Upload or update your resume.
            </p>

          )}

        </div>


        {/* QUICK LINKS */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">

          <Link
            to="/resume"
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow"
          >

            <FileText
              size={22}
              className="text-gray-600"
            />

            <h3 className="mt-3 font-semibold text-gray-900">
              Resume Details
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              View and edit your complete resume information.
            </p>

          </Link>


          <Link
            to="/interview/history"
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow"
          >

            <Briefcase
              size={22}
              className="text-gray-600"
            />

            <h3 className="mt-3 font-semibold text-gray-900">
              Interview History
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              View your previous interviews and AI feedback.
            </p>

          </Link>

        </div>

      </div>
      <ActiveInterviewBar/>
    </div>
  );
}

export default Profile;