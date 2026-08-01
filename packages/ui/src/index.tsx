import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2";
  const variants = {
    primary: "bg-brand-500 hover:bg-brand-500/90 text-white focus:ring-brand-500/50",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
