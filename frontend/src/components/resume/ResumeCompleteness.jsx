import { CheckCircle2, AlertCircle } from "lucide-react";

function ResumeCompleteness({ resume }) {
  const skills = resume?.skills || [];
  const education = resume?.education || [];
  const experience = resume?.experience || [];
  const projects = resume?.projects || [];
  const certifications = resume?.certifications || [];

  const checks = [
    {
      label: "Skills",
      completed: skills.length > 0,
      points: 20,
    },
    {
      label: "Education",
      completed: education.length > 0,
      points: 30,
    },
    {
      label: "Experience",
      completed: experience.length > 0,
      points: 30,
    },
    {
      label: "Projects",
      completed: projects.length > 0,
      points: 20,
    },
  ];

  const score = checks.reduce(
    (total, item) =>
      item.completed ? total + item.points : total,
    0
  );

  const missingSections = checks.filter(
    (item) => !item.completed
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">

      <div className="flex justify-between items-center mb-5">

        <div>
          <h2 className="text-xl font-semibold">
            Resume Completeness
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Based on the information available in your resume
          </p>
        </div>

        <div className="text-right">
          <p className="text-3xl font-bold">
            {score}%
          </p>

          <p className="text-sm text-gray-500">
            Complete
          </p>
        </div>

      </div>

      {/* Progress Bar */}

      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

        <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${score}%` }}
        />

      </div>

      {/* Checklist */}

      <div className="grid md:grid-cols-2 gap-3 mt-6">

        {checks.map((item) => (

          <div
            key={item.label}
            className="flex items-center justify-between border rounded-lg p-3"
          >

            <div className="flex items-center gap-3">

              {item.completed ? (
                <CheckCircle2
                  size={20}
                  className="text-green-600"
                />
              ) : (
                <AlertCircle
                  size={20}
                  className="text-orange-500"
                />
              )}

              <span>
                {item.label}
              </span>

            </div>

            <span className="text-sm text-gray-500">
              {item.completed
                ? `+${item.points}`
                : `+${item.points} available`}
            </span>

          </div>

        ))}

      </div>

      {/* Suggestions */}

      {missingSections.length > 0 && (

        <div className="mt-5 bg-orange-50 border border-orange-200 rounded-lg p-4">

          <p className="font-medium text-orange-800">
            Improve your resume
          </p>

          <p className="text-sm text-orange-700 mt-1">
            Consider adding:
          </p>

          <ul className="list-disc ml-5 mt-2 text-sm text-orange-700">

            {missingSections.map((item) => (
              <li key={item.label}>
                {item.label}
              </li>
            ))}

          </ul>

        </div>

      )}

      {score === 100 && (

        <div className="mt-5 bg-green-50 border border-green-200 rounded-lg p-4">

          <p className="font-medium text-green-800">
            Your resume looks complete! 🎉
          </p>

          <p className="text-sm text-green-700 mt-1">
            You are ready to move on to interview preparation.
          </p>

        </div>

      )}

    </div>
  );
}

export default ResumeCompleteness;