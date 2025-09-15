import { FcGoogle } from "react-icons/fc";
import React from "react";

const GoogleLoading = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
      <FcGoogle className="text-6xl animate-bounce mb-4" />
      <p className="text-lg font-medium text-gray-700">Signing you in with Google...</p>
      <div className="mt-6 flex justify-center">
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-3 h-3 rounded-full bg-blue-500 animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`,
                display: "inline-block",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoogleLoading;
