import { forwardRef, useState } from "react";
import Input from "./Input";

const PasswordInput = forwardRef(({ label, error, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        ref={ref}
        label={label}
        error={error}
        type={showPassword ? "text" : "password"}
        {...props}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-11 text-blue-600 text-sm"
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
