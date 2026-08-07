import React from "react";

function EducationEditor({ education, setEducation }) {
  const handleChange = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        degree: "",
        institution: "",
        year: "",
        score: "",
      },
    ]);
  };

  const removeEducation = (index) => {
    setEducation(
      education.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-semibold">
          Education
        </h2>

        <button
          onClick={addEducation}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add
        </button>

      </div>

      {education.length === 0 && (
        <p className="text-gray-500">
          No education added.
        </p>
      )}

      {education.map((item, index) => (

        <div
          key={index}
          className="border rounded-xl p-5 mb-5 space-y-4"
        >

          <input
            className="w-full border rounded-lg p-2"
            placeholder="Degree"
            value={item.degree}
            onChange={(e) =>
              handleChange(index, "degree", e.target.value)
            }
          />

          <input
            className="w-full border rounded-lg p-2"
            placeholder="Institution"
            value={item.institution}
            onChange={(e) =>
              handleChange(
                index,
                "institution",
                e.target.value
              )
            }
          />

          <input
            className="w-full border rounded-lg p-2"
            placeholder="Year"
            value={item.year}
            onChange={(e) =>
              handleChange(index, "year", e.target.value)
            }
          />

          <input
            className="w-full border rounded-lg p-2"
            placeholder="Score / CGPA"
            value={item.score}
            onChange={(e) =>
              handleChange(index, "score", e.target.value)
            }
          />

          <button
            onClick={() => removeEducation(index)}
            className="text-red-600"
          >
            Delete
          </button>

        </div>

      ))}

    </div>
  );
}

export default EducationEditor;