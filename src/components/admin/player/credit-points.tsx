import React from "react";
import { TextField } from "@mui/material";
import CustomButton from "@/components/button";
import axios from "axios";

const CreditWin = ({ playerId }: { playerId: string }) => {
  const [creditPoints, setCreditPoints] = React.useState<number>(1);
  return (
    <div className={"flex flex-row gap-2"}>
      <TextField
        type={"number"}
        id={"creditWins"}
        label={"Credit Points"}
        variant={"outlined"}
        className={"w-full"}
        defaultValue={1}
        onChange={(e) => {
          setCreditPoints(parseInt(e.target.value));
        }}
      />
      <CustomButton
        variant={"outlined"}
        className={"w-1/2"}
        disabled={!creditPoints || isNaN(creditPoints)}
        onClickLoading={async () => {
          await axios.put(`/api/admin/players/update`, {
            id: playerId,
            points: {
              increment: creditPoints,
            },
          });
          window.location.reload();
        }}
      >
        {creditPoints > 0 ? "Add" : "Deduct"} Point
      </CustomButton>
    </div>
  );
};

export default CreditWin;
