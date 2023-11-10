"use client";

import React, { useEffect } from "react";
import { ButtonProps } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { FaX, FaCheck } from "react-icons/fa6";

const CustomButton = ({
  showStatusColor = true,
  ...props
}: {
  onClickLoading?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<any>;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onPress?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  toggle?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  showStatusColor?: boolean;
} & React.ComponentProps<typeof LoadingButton>) => {
  const [loading, setLoading] = React.useState(false);
  const [statusIcon, setStatusIcon] = React.useState<React.ReactNode | null>(
    null
  );
  const [btnColor, setBtnColor] = React.useState<
    ButtonProps["color"] | undefined
  >(props.color);
  useEffect(() => {
    setBtnColor(props.color);
  }, [props.color]);
  const propsCopy = { ...props };
  delete propsCopy.onClickLoading; // fix invalid event handler error
  delete propsCopy.color;
  return (
    <>
      <LoadingButton
        startIcon={statusIcon}
        color={btnColor || "primary"}
        onClick={(e) => {
          if (props.onClickLoading) {
            setLoading(true);
            const promise = props.onClickLoading(e);
            if (promise) {
              let error = false;
              promise
                .catch((e: any) => {
                  error = true;
                  if (e?.response) {
                    // if there is res.data.message, show it
                    if (e.response.data.message) {
                      /*
                             showModal({
                               title: "Error",
                               body: e.response.data.message,
                               footer: (
                                 <MUIButton
                                   color={"danger"}
                                   onPress={closeModal}
                                 >
                                   Close
                                 </MUIButton>
                               )
                             });
                              */
                      console.error(e.response.data.message);
                    }
                  }
                })
                .finally(() => {
                  setLoading(false);
                  if (showStatusColor) {
                    const originalColor = props.color;
                    setBtnColor(error ? "error" : "success");
                    setStatusIcon(error ? <FaX /> : <FaCheck />);
                    setTimeout(() => {
                      setBtnColor(originalColor);
                      setStatusIcon(null);
                      /*if (props.closeModal) {
                               props.closeModal();
                             }*/
                    }, 1000);
                  }
                });
            } else {
              setLoading(false);
            }
          } else if (props.onClick) {
            props.onClick(e);
          } else if (props.onPress) {
            props.onPress(e);
          } else if (props.toggle) {
            props.toggle[1](!props.toggle[0]);
          }
        }}
        loading={loading}
        {...propsCopy}
      >
        {props.children}
      </LoadingButton>
    </>
  );
};

export default CustomButton;
