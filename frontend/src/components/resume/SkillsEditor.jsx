import { useState } from "react";

function SkillsEditor({ skills, setSkills }) {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    const skill = newSkill.trim();

    if (!skill) return;

    // Duplicate prevent
    if (
      skills.some(
        (item) => item.toLowerCase() === skill.toLowerCase()
      )
    ) {
      setNewSkill("");
      return;
    }

    setSkills([...skills, skill]);

    setNewSkill("");
  };

  const removeSkill = (index) => {
    setSkills(
      skills.filter((_, i) => i !== index)
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-2xl font-semibold mb-5">
        Skills
      </h2>

      {/* Skill Chips */}

      <div className="flex flex-wrap gap-3 mb-6">

        {skills.length === 0 ? (
          <p className="text-gray-500">
            No skills found.
          </p>
        ) : (
          skills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full"
            >
              <span>{skill}</span>

              <button
                onClick={() => removeSkill(index)}
                className="font-bold hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))
        )}

      </div>

      {/* Add Skill */}

      <div className="flex gap-3">

        <input
          type="text"
          value={newSkill}
          placeholder="Add a skill"
          onChange={(e) =>
            setNewSkill(e.target.value)
          }
          onKeyDown={handleKeyDown}
          className="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={addSkill}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg"
        >
          Add
        </button>

      </div>

    </div>
  );
}

export default SkillsEditor;