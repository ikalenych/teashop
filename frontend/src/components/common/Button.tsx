import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "filled" | "outline";
  theme?: "primary" | "white";
  onClick?: () => void;
  className?: string;
}

export const Button = ({
  children,
  variant = "filled",
  theme = "primary",
  onClick,
  className = "",
}: ButtonProps) => {
  const baseStyles =
    "px-8 py-3 font-montserrat text-sm uppercase tracking-wider transition-all duration-300 font-medium";

  const variants = {
    // Filled кнопки
    filled: {
      primary: "bg-primary text-primary-on hover:opacity-90",
      white: "bg-primary-on text-primary hover:opacity-90",
    },
    // Outline кнопки
    outline: {
      primary:
        "border-2 border-primary text-primary hover:bg-primary hover:text-primary-on",
      white:
        "border-2 border-primary-on text-primary-on hover:bg-primary-on hover:text-primary",
    },
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant][theme]} ${className}`}
    >
      {children}
    </button>
  );
};
