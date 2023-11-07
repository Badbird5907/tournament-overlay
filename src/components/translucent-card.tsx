import { Card } from "@mui/joy";
import { ComponentProps } from "react";

type TranslucentCardProps = {
  transparency?: number;
  // enableBlur?: boolean;
  enable?: boolean;
} & ComponentProps<typeof Card>;

export const TranslucentCard = ({
  transparency = 0.85,
  // enableBlur = true,
  enable = true,
  ...props
}: TranslucentCardProps) => {
  if (!enable) return <Card {...props}>{props.children}</Card>;
  return (
    <Card
      style={{
        backgroundColor: `rgba(0,0,0,${transparency})`,
        // backdropFilter: enableBlur ? "blur(10px)" : "none",
      }}
      {...props}
    >
      {props.children}
    </Card>
  );
};
