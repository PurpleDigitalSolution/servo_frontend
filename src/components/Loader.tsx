import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fullPage?: boolean;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = "md",
  className = "",
  fullPage = false,
  text
}) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
    xl: "w-16 h-16 border-4",
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full border-primary/30 border-t-primary animate-spin`}
      />
      {text && <p className="text-text-secondary text-sm">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;