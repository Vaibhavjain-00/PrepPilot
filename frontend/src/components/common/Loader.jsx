import React from 'react'

function Loader() {
  return (
    <div className="flex justify-center py-10">
      <div
        className="
          h-10
          w-10
          animate-spin
          rounded-full
          border-4
          border-blue-600
          border-t-transparent
        "
      />
    </div>
  );
}

export default Loader;