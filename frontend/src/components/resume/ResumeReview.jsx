import { useState } from "react";

import SkillsEditor from "./SkillsEditor";
import EducationEditor from "./EducationEditor";
import ExperienceEditor from "./ExperienceEditor";
import ProjectsEditor from "./ProjectsEditor";

import resumeService from "../../services/resume.service";

import toast from "react-hot-toast";

function ResumeReview({ resume, refreshResume }) {
  const [skills, setSkills] = useState(resume.skills || []);

  const [education, setEducation] = useState(resume.education || []);

  const [experience, setExperience] = useState(resume.experience || []);

  const [projects, setProjects] = useState(resume.projects || []);

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      await resumeService.updateResume({
        skills,
        education,
        experience,
        projects,
      });

      toast.success("Resume updated successfully");

      refreshResume();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Resume Details</h1>

      <SkillsEditor skills={skills} setSkills={setSkills} />

      <EducationEditor education={education} setEducation={setEducation} />

      <ExperienceEditor experience={experience} setExperience={setExperience} />

      <ProjectsEditor projects={projects} setProjects={setProjects} />

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

export default ResumeReview;
