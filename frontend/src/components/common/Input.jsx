import { forwardRef } from "react";

const Input = forwardRef(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="font-medium">
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={`
            w-full
            rounded-lg
            border
            border-gray-300
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-blue-500
            ${className}
          `}
          {...props}
        />

        {error && (
          <p className="text-sm text-red-500">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;