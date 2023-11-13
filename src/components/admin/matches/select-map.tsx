import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import useSWR from "swr";

const SelectMap = () => {
  const { data, isLoading } = useSWR<string[]>("/api/admin/maps/get");
  console.log(data);
  return (
    <Autocomplete
      id="map"
      freeSolo
      options={data || []}
      renderInput={(params) => <TextField {...params} label="Map" required />}
    />
  );
};

export default SelectMap;
