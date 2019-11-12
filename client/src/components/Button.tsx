import React from "react";
import cn from "classnames";

interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}

export const Button = ({ className = "", ...props }: ButtonProps) => {
  const enabledStyle = "hover:bg-blue-200 bg-gray-300 border-black";
  const disabledStyle =
    "cursor-not-allowed bg-gray-500 text-gray-600 border-white";
  return (
    <div className={className}>
      <button
        className={cn(
          "w-full border h-full",
          props.disabled ? disabledStyle : enabledStyle
        )}
        {...props}
      />
    </div>
  );
};
