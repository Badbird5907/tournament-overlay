import axios from "axios";
import { TextField } from "@mui/material";
import CustomButton from "@/components/button";
import Card from "@/components/card";
import React from "react";
import { Players } from ".prisma/client";
import { getInputValues } from "@/util/client";

const EditPlayer = (props: { player: Players }) => {
  return (
    <Card className={"bg-gray-800"}>
      <form
        className={"flex flex-col gap-4"}
        onSubmit={(e) => {
          e.preventDefault();
          const values = getInputValues("edit");
          axios
            .put("/api/admin/players/update", {
              id: props.player.id,
              ...values,
            })
            .then((res) => {
              window.location.reload();
            });
        }}
      >
        <TextField
          type="text"
          id="edit-name"
          name="name"
          label={"Name"}
          required
          defaultValue={props.player.name}
        />
        <TextField
          type="email"
          id="edit-email"
          name="email"
          label={"Email"}
          required
          defaultValue={props.player.email}
        />
        <TextField
          type="text"
          id="edit-description"
          name="description"
          label={"Description"}
          defaultValue={props.player.description}
        />
        <div className={"flex flex-row gap-2 w-full"}>
          <TextField
            type="number"
            id="edit-wins"
            name="wins"
            label={"Wins"}
            className={"w-1/2"}
            defaultValue={props.player.wins}
          />
          <TextField
            type="number"
            id="edit-losses"
            name="losses"
            label={"Losses"}
            className={"w-1/2"}
            defaultValue={props.player.losses}
          />
        </div>
        <TextField
          type="number"
          id="edit-points"
          name="points"
          label={"Points"}
          defaultValue={props.player.points}
        />
        <CustomButton variant={"outlined"} type={"submit"}>
          Submit
        </CustomButton>
      </form>
    </Card>
  );
};

export default EditPlayer;
