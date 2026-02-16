import { useState } from "react";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

export const AuthForms = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Toggle Buttons */}
        <div className="flex mb-8">
          <button
            onClick={() => setIsSignIn(true)}
            className={`flex-1 py-3 font-montserrat font-medium uppercase tracking-wider border-b-2 transition-colors ${
              isSignIn
                ? "border-primary text-primary"
                : "border-outline text-primary opacity-60 hover:opacity-100"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`flex-1 py-3 font-montserrat font-medium uppercase tracking-wider border-b-2 transition-colors ${
              !isSignIn
                ? "border-primary text-primary"
                : "border-outline text-primary opacity-60 hover:opacity-100"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        {isSignIn ? <SignInForm /> : <SignUpForm />}
      </div>
    </div>
  );
};
