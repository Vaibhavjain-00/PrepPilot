import React from "react";

function Loader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-1">
        <span className="text-4xl font-extrabold tracking-tight text-gray-900">
          Prep
        </span>

        <span className="text-4xl font-extrabold tracking-tight text-blue-600">
          Pilot
        </span>
      </div>

      {/* Loader */}
      <div
        className="
          h-9
          w-9
          animate-spin
          rounded-full
          border-4
          border-blue-600
          border-t-transparent
        "
      />

      <p className="mt-4 text-sm font-medium tracking-wide text-gray-400">
        Preparing your experience...
      </p>
    </div>
  );
}

export default Loader;