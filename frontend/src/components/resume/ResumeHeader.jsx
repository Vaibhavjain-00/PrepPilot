import { FileText } from "lucide-react";

function ResumeHeader() {
  return (
    <div className="flex items-center gap-4 mb-8">

      <div className="bg-blue-100 p-3 rounded-xl">
        <FileText
          className="text-blue-600"
          size={28}
        />
      </div>

      <div>

        <h1 className="text-3xl font-bold">
          Resume
        </h1>

        <p className="text-gray-500">
          Review and edit your AI parsed resume.
        </p>

      </div>

    </div>
  );
}

export default ResumeHeader;