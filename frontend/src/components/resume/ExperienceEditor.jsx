import React from "react";

function ExperienceEditor({
  experience,
  setExperience,
}) {
  const handleChange = (
    index,
    field,
    value
  ) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  const addExperience = () => {
    setExperience([
      ...experience,
      {
        company: "",
        role: "",
        duration: "",
        description: "",
      },
    ]);
  };

  const removeExperience = (index) => {
    setExperience(
      experience.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-semibold">
          Experience
        </h2>

        <button
          onClick={addExperience}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add
        </button>

      </div>

      {experience.length === 0 && (
        <p className="text-gray-500">
          No experience added.
        </p>
      )}

      {experience.map((item, index) => (

        <div
          key={index}
          className="border rounded-xl p-5 mb-5 space-y-4"
        >

          <input
            className="w-full border rounded-lg p-2"
            placeholder="Company"
            value={item.company}
            onChange={(e) =>
              handleChange(
                index,
                "company",
                e.target.value
              )
            }
          />

          <input
            className="w-full border rounded-lg p-2"
            placeholder="Role"
            value={item.role}
            onChange={(e) =>
              handleChange(index, "role", e.target.value)
            }
          />

          <input
            className="w-full border rounded-lg p-2"
            placeholder="Duration"
            value={item.duration}
            onChange={(e) =>
              handleChange(
                index,
                "duration",
                e.target.value
              )
            }
          />

          <textarea
            rows={4}
            className="w-full border rounded-lg p-2"
            placeholder="Description"
            value={item.description}
            onChange={(e) =>
              handleChange(
                index,
                "description",
                e.target.value
              )
            }
          />

          <button
            onClick={() => removeExperience(index)}
            className="text-red-600"
          >
            Delete
          </button>

        </div>

      ))}

    </div>
  );
}

export default ExperienceEditor;