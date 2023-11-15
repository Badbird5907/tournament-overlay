import React from "react";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import { Players } from ".prisma/client";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import useSWR from "swr";
import { AutocompleteValue } from "@mui/base/useAutocomplete/useAutocomplete";

const icon = <MdCheckBoxOutlineBlank />;
const checkedIcon = <MdCheckBox />;
const SelectPlayer = ({
  label = "Select Players",
  ...props
}: {
  onChange: (value: any) => void;
  defaultValue?: AutocompleteValue<any, any, any, any> | undefined;
  multiple?: boolean;
  label?: string;
  loading?: boolean;
  players?: Players[] | undefined;
}) => {
  const { data, isLoading } = useSWR<{
    data: Players[];
  }>("/api/admin/players/get?limit=1000");
  return (
    <Autocomplete
      multiple={props.multiple}
      id="select-players"
      options={props.players || data?.data || []}
      disableCloseOnSelect
      loading={isLoading || props.loading}
      defaultValue={props.defaultValue}
      getOptionLabel={(option) =>
        `(${option.wins + option.losses}) ${option.name}`
      }
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          ({option.wins + option.losses}) {option.name}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder="Player(s)" />
      )}
      onChange={(e, value) => {
        if (props.multiple) props.onChange(value.map((v: Players) => v.id));
        else props.onChange(value);
      }}
    />
  );
};

export default SelectPlayer;
