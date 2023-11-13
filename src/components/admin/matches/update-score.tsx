import React, { useMemo } from "react";
import { CircularProgress, Input, TextField } from "@mui/material";
import { DebounceInput } from "react-debounce-input";
import axios from "axios";
import { MatchPlayer } from ".prisma/client";

const UpdateScore = ({
  id,
  matchId,
  endResult,
}: {
  id: string;
  matchId: string;
  endResult: MatchPlayer[] | undefined;
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const defaultScore = useMemo(() => {
    return endResult && endResult.find((p) => p.id === id)?.pointsGained;
  }, [endResult, id]);
  return (
    <div>
      <DebounceInput
        debounceTimeout={300}
        element={Input}
        type={"number"}
        placeholder={"Score"}
        value={defaultScore}
        endAdornment={
          <>{loading ? <CircularProgress color="inherit" size={20} /> : null}</>
        }
        onChange={(e) => {
          setLoading(true);
          const val = parseInt(e.target.value);
          axios
            .post("/api/admin/matches/score", {
              playerId: id,
              matchId,
              score: isNaN(val) ? 0 : val,
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      />
    </div>
  );
};

export default UpdateScore;
