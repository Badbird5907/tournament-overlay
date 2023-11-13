import React from "react";
import SelectPlayer from "@/components/admin/matches/select-player";
import axios from "axios";
import { Players } from ".prisma/client";

const SelectWinner = ({
  matchId,
  defaultValue,
}: {
  matchId: string;
  defaultValue?: Players | undefined | null;
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  return (
    <div>
      <SelectPlayer
        defaultValue={defaultValue}
        onChange={(val) => {
          console.log(val);
          setLoading(true);
          axios
            .post("/api/admin/matches/winner", {
              matchId,
              playerId: val.id,
            })
            .finally(() => {
              setLoading(false);
            });
        }}
        label={"Winner"}
        loading={loading}
      />
    </div>
  );
};

export default SelectWinner;
