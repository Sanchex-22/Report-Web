// components/Alert.tsx
import React from "react";

interface AlertProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  const textColor = "text-white";

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${bgColor} ${textColor} z-50`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 bg-transparent border-none text-white text-lg focus:outline-none"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Alert;
