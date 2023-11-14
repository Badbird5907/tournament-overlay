import React from "react";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getPlayerById, getPlayersByIds } from "@/prisma/players";
import AdminWrapper from "@/components/admin/wrapper";
import { Grid, TextField } from "@mui/material";
import CustomButton from "@/components/button";
import axios from "axios";
import Matches from "@/components/admin/matches";
import Swal from "sweetalert2";
import CreditWin from "@/components/admin/player/credit-win";
import Card from "@/components/card";
import EditPlayer from "@/components/admin/player/edit-player";
import CreditPoints from "@/components/admin/player/credit-points";

const EditPlayerPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return (
    <AdminWrapper>
      <div className={"flex flex-col items-center justify-center"}>
        <h1 className={"text-4xl font-bold"}>Edit Player</h1>
        <Grid container className={"w-full pt-4"} spacing={2}>
          <Grid item xs={12} md={4}>
            <div className={"flex flex-col"}>
              <EditPlayer player={props.player} />
              <Card className={"bg-gray-800 mt-4"}>
                <h1 className={"text-2xl font-bold text-center"}>Actions</h1>
                <div className={"flex flex-col gap-6 pt-4"}>
                  <CustomButton
                    variant={"outlined"}
                    color={"error"}
                    className={"w-full py-3"}
                    onClickLoading={async () => {
                      const result = await Swal.fire({
                        title: "Are you sure?",
                        text: "You will not be able to recover this player!",
                        icon: "warning",
                        showCancelButton: true,
                      });
                      if (!result.isConfirmed) {
                        throw new Error("Cancelled");
                      }
                      const res = await axios.post(
                        `/api/admin/players/delete`,
                        {
                          ids: [props.player.id],
                        }
                      );
                      console.log(res.data);
                      window.location.href = "/admin/players";
                    }}
                  >
                    Delete
                  </CustomButton>
                  <CreditWin playerId={props.player.id} />
                  <CreditPoints playerId={props.player.id} />
                </div>
              </Card>
            </div>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card className={"bg-gray-800"}>
              <h1 className={"text-2xl font-bold text-center"}>
                Match History
              </h1>
              <Matches
                embedded
                initialQuery={{
                  page: 1,
                  player: props.player.id,
                }}
              />
            </Card>
          </Grid>
        </Grid>
      </div>
    </AdminWrapper>
  );
};

export default EditPlayerPage;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  if (typeof id !== "string") {
    return {
      notFound: true,
    };
  }
  const player = await getPlayerById(id);
  if (!player) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      player,
    },
  };
}
