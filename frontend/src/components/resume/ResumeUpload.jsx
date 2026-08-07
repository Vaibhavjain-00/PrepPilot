import { useRef, useState } from "react";
import resumeService from "../../services/resume.service";

function ResumeUpload({ onUpload }) {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const handleFileChange = (selectedFile) => {
    setError("");
    setSuccess("");

    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only PDF and DOCX files are allowed.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Maximum file size is 5 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a resume first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("resume", file);

      await resumeService.uploadResume(formData);

      setSuccess("Resume uploaded successfully.");

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onUpload();

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Resume upload failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">

      <h2 className="text-3xl font-bold mb-2">
        Upload Resume
      </h2>

      <p className="text-gray-500 mb-8">
        Upload your latest resume to generate
        personalized interviews.
      </p>

      <div
        onClick={() => fileInputRef.current.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-blue-500 transition"
      >
        <p className="text-lg font-medium">
          Click to choose a resume
        </p>

        <p className="text-sm text-gray-500 mt-2">
          PDF or DOCX (Max 5 MB)
        </p>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept=".pdf,.docx"
          onChange={(e) =>
            handleFileChange(e.target.files[0])
          }
        />
      </div>

      {file && (
        <div className="mt-5 rounded-lg bg-gray-100 p-4">
          <p className="font-medium">
            Selected File
          </p>

          <p className="text-sm text-gray-600 mt-1">
            {file.name}
          </p>
        </div>
      )}

      {error && (
        <div className="mt-5 bg-red-100 border border-red-300 text-red-700 rounded-lg p-3">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-5 bg-green-100 border border-green-300 text-green-700 rounded-lg p-3">
          {success}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold disabled:opacity-60"
      >
        {loading
          ? "Uploading..."
          : "Upload Resume"}
      </button>
    </div>
  );
}

export default ResumeUpload;