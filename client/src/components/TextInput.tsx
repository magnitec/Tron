import React, { useState } from "react";
import cn from "classnames";

interface TextInputProps {
  className?: string;
  readOnly?: boolean;
  onChange: (value: string) => void;
  defaultValue?: string;
}

export const TextInput = ({
  className = "",
  onChange,
  readOnly,
  defaultValue = ""
}: TextInputProps) => {
  const [text, setText] = useState(defaultValue);

  return (
    <div className="border border-gray-500 inline-block">
      <input
        style={{ transition: "background-color 0.1s ease" }}
        className={cn("px-1", className, { "bg-gray-200": readOnly })}
        type="text"
        readOnly={readOnly}
        value={text}
        onChange={({ target: { value } }) => {
          setText(value);
          onChange(value);
        }}
      />
    </div>
  );
};
