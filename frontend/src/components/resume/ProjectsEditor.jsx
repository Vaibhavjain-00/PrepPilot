import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

function ProjectsEditor({ projects, setProjects }) {
  const [newTechnology, setNewTechnology] = useState({});

  const handleChange = (index, field, value) => {
    const updatedProjects = [...projects];

    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    };

    setProjects(updatedProjects);
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        title: "",
        description: "",
        technologies: [],
      },
    ]);
  };

  const removeProject = (index) => {
    setProjects(
      projects.filter((_, i) => i !== index)
    );
  };

  const addTechnology = (index) => {
    const technology = (
      newTechnology[index] || ""
    ).trim();

    if (!technology) return;

    const currentTechnologies =
      projects[index].technologies || [];

    const alreadyExists =
      currentTechnologies.some(
        (item) =>
          item.toLowerCase() ===
          technology.toLowerCase()
      );

    if (alreadyExists) {
      setNewTechnology({
        ...newTechnology,
        [index]: "",
      });

      return;
    }

    const updatedProjects = [...projects];

    updatedProjects[index] = {
      ...updatedProjects[index],
      technologies: [
        ...currentTechnologies,
        technology,
      ],
    };

    setProjects(updatedProjects);

    setNewTechnology({
      ...newTechnology,
      [index]: "",
    });
  };

  const removeTechnology = (
    projectIndex,
    technologyIndex
  ) => {
    const updatedProjects = [...projects];

    updatedProjects[projectIndex] = {
      ...updatedProjects[projectIndex],
      technologies:
        updatedProjects[
          projectIndex
        ].technologies.filter(
          (_, index) =>
            index !== technologyIndex
        ),
    };

    setProjects(updatedProjects);
  };

  const handleTechnologyKeyDown = (
    e,
    index
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      addTechnology(index);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-semibold">
            Projects
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Review and edit projects extracted
            from your resume.
          </p>
        </div>

        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />

          Add Project
        </button>

      </div>

      {projects.length === 0 && (
        <div className="border border-dashed rounded-xl p-8 text-center">

          <p className="text-gray-500">
            No projects found in your resume.
          </p>

          <button
            type="button"
            onClick={addProject}
            className="mt-3 text-blue-600 hover:underline"
          >
            Add your first project
          </button>

        </div>
      )}

      <div className="space-y-6">

        {projects.map((project, projectIndex) => (

          <div
            key={projectIndex}
            className="border rounded-xl p-5"
          >

            {/* Header */}

            <div className="flex justify-between items-center mb-5">

              <h3 className="font-semibold">
                Project {projectIndex + 1}
              </h3>

              <button
                type="button"
                onClick={() =>
                  removeProject(projectIndex)
                }
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={19} />
              </button>

            </div>

            {/* Title */}

            <div className="mb-4">

              <label className="block text-sm font-medium mb-1">
                Project Name
              </label>

              <input
                type="text"
                value={project.title || ""}
                onChange={(e) =>
                  handleChange(
                    projectIndex,
                    "title",
                    e.target.value
                  )
                }
                placeholder="e.g. PrepPilot"
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Description */}

            <div className="mb-4">

              <label className="block text-sm font-medium mb-1">
                Description
              </label>

              <textarea
                rows={4}
                value={
                  project.description || ""
                }
                onChange={(e) =>
                  handleChange(
                    projectIndex,
                    "description",
                    e.target.value
                  )
                }
                placeholder="Describe what you built..."
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />

            </div>

            {/* Technologies */}

            <div>

              <label className="block text-sm font-medium mb-2">
                Technologies
              </label>

              <div className="flex flex-wrap gap-2 mb-3">

                {(project.technologies || []).map(
                  (technology, technologyIndex) => (

                    <div
                      key={technologyIndex}
                      className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm"
                    >

                      <span>
                        {technology}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeTechnology(
                            projectIndex,
                            technologyIndex
                          )
                        }
                        className="font-bold hover:text-red-600"
                      >
                        ×
                      </button>

                    </div>

                  )
                )}

              </div>

              <div className="flex gap-2">

                <input
                  type="text"
                  value={
                    newTechnology[
                      projectIndex
                    ] || ""
                  }
                  onChange={(e) =>
                    setNewTechnology({
                      ...newTechnology,
                      [projectIndex]:
                        e.target.value,
                    })
                  }
                  onKeyDown={(e) =>
                    handleTechnologyKeyDown(
                      e,
                      projectIndex
                    )
                  }
                  placeholder="Add technology"
                  className="flex-1 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    addTechnology(
                      projectIndex
                    )
                  }
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Add
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default ProjectsEditor;