import React from "react";
import SelectPlayer from "@/components/admin/matches/select-player";
import axios from "axios";
import { Players } from ".prisma/client";

const SelectWinner = ({
  matchId,
  defaultValue,
  players,
}: {
  matchId: string;
  defaultValue?: Players | undefined | null;
  players?: Players[] | undefined;
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  return (
    <div>
      <SelectPlayer
        defaultValue={defaultValue}
        players={players}
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
