import React from "react";

interface CardProps {
  children: React.ReactNode;
  width?: string;
  className?: string;
  color?: "purple" | "black";
  style?: React.CSSProperties;
}

const Card = ({ ...props }: CardProps) => {
  return (
    <div
      className={`rounded-lg shadow border ${
        props.color && props.color === "purple"
          ? "bg-primary-800"
          : "bg-gray-800"
      } border-gray-700 p-4 flex-none ${
        props.width ? `md:w-${(props.width as string) || "80"}` : ""
      } ${props.className ? props.className : ""}`}
      style={props.style}
    >
      {props.children}
    </div>
  );
};

export default Card;