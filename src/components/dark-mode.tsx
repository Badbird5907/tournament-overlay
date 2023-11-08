import React, { useEffect } from "react";
import { useColorScheme as useJoyColorScheme } from "@mui/joy/styles";
import { useColorScheme as useMaterialColorScheme } from "@mui/material/styles";

const DarkMode = () => {
  const { mode, setMode: setMaterialMode } = useMaterialColorScheme();
  const { setMode: setJoyMode } = useJoyColorScheme();
  useEffect(() => {
    setJoyMode("dark");
    setMaterialMode("dark");
  }, [mode, setJoyMode, setMaterialMode]);
  return null;
};

export default DarkMode;
