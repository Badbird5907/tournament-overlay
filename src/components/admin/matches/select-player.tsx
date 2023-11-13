import React from "react";
import {
  Autocomplete,
  Checkbox,
  CircularProgress,
  TextField,
} from "@mui/material";
import { Players } from ".prisma/client";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import useSWR from "swr";

const icon = <MdCheckBoxOutlineBlank />;
const checkedIcon = <MdCheckBox />;
const SelectPlayer = (props: { onChange: (value: string[]) => void }) => {
  const { data, isLoading } = useSWR<{
    data: Players[];
  }>("/api/admin/players/get?limit=1000");
  return (
    <Autocomplete
      multiple
      id="select-players"
      options={data?.data || []}
      disableCloseOnSelect
      loading={isLoading}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.name}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Select Players" placeholder="Players" />
      )}
      onChange={(e, value) => {
        props.onChange(value.map((v) => v.id));
      }}
    />
  );
};

export default SelectPlayer;
