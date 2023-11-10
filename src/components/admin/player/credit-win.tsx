import React from "react";
import { TextField } from "@mui/material";
import CustomButton from "@/components/button";
import axios from "axios";

const CreditWin = ({ playerId }: { playerId: string }) => {
  const [creditWins, setCreditWins] = React.useState<number>(1);
  return (
    <div className={"flex flex-row gap-2"}>
      <TextField
        type={"number"}
        id={"creditWins"}
        label={"Credit Wins"}
        variant={"outlined"}
        className={"w-full"}
        defaultValue={1}
        onChange={(e) => {
          setCreditWins(parseInt(e.target.value));
        }}
      />
      <CustomButton
        variant={"outlined"}
        className={"w-1/2"}
        disabled={!creditWins || isNaN(creditWins)}
        onClickLoading={async () => {
          await axios.put(`/api/admin/players/update`, {
            id: playerId,
            wins: {
              increment: creditWins,
            },
          });
          window.location.reload();
        }}
      >
        {creditWins > 0 ? "Add" : "Deduct"} Win
      </CustomButton>
    </div>
  );
};

export default CreditWin;
