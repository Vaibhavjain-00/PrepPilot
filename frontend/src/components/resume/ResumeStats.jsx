import {
  Brain,
  GraduationCap,
  Briefcase,
  FolderKanban,
} from "lucide-react";

function ResumeStats({ resume }) {
  return (
    <div className="grid md:grid-cols-4 gap-5 mb-8">

  <div className="bg-white rounded-xl shadow p-5">
    <Brain size={30} className="text-blue-600 mb-3" />

    <p className="text-gray-500">
      Skills
    </p>

    <h2 className="text-3xl font-bold">
      {(resume.skills || []).length}
    </h2>
  </div>

  <div className="bg-white rounded-xl shadow p-5">
    <GraduationCap size={30} className="text-green-600 mb-3" />

    <p className="text-gray-500">
      Education
    </p>

    <h2 className="text-3xl font-bold">
      {(resume.education || []).length}
    </h2>
  </div>

  <div className="bg-white rounded-xl shadow p-5">
    <Briefcase size={30} className="text-purple-600 mb-3" />

    <p className="text-gray-500">
      Experience
    </p>

    <h2 className="text-3xl font-bold">
      {(resume.experience || []).length}
    </h2>
  </div>

  <div className="bg-white rounded-xl shadow p-5">
    <FolderKanban size={30} className="text-orange-600 mb-3" />

    <p className="text-gray-500">
      Projects
    </p>

    <h2 className="text-3xl font-bold">
      {(resume.projects || []).length}
    </h2>
  </div>

</div>
  );
}

export default ResumeStats;