import React, { useMemo } from "react";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import AdminWrapper from "@/components/admin/wrapper";
import { Button, Grid, TextField } from "@mui/material";
import Card from "@/components/card";
import { getMatch } from "@/prisma/matches";
import {
  getInputValues,
  setSettingClient,
  useCurrentMatch,
} from "@/util/client";
import axios from "axios";
import SelectPlayer from "@/components/admin/matches/select-player";
import { getPlayer, getPlayersByIds } from "@/prisma/players";
import CustomButton from "@/components/button";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import Link from "next/link";
import { FaEdit, FaPlus } from "react-icons/fa";
import UpdateScore from "@/components/admin/matches/update-score";
import SelectWinner from "@/components/admin/matches/select-winner";
import { useSWRConfig } from "swr";
import Swal from "sweetalert2";

const ModifyMatchPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const currentMatch = useCurrentMatch();
  const swrConfig = useSWRConfig();
  const [players, setPlayers] = React.useState<string[]>(props.match.players);
  const [loading, setLoading] = React.useState<boolean>(false);
  const cols = useMemo(() => {
    return [
      {
        field: "name",
        headerName: "Name",
        width: 200,
        sortable: false,
      },
      {
        field: "email",
        headerName: "Email",
        width: 220,
        sortable: false,
      },
      {
        field: "_dummy",
        headerName: "Actions",
        width: 300,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <>
              <div>
                <UpdateScore
                  endResult={props.match.endResult}
                  matchId={props.match.id}
                  id={params.row.id}
                />
              </div>
              <Button
                variant={"outlined"}
                className={"w-full h-full"}
                onClick={() => {
                  Swal.fire({
                    title: "Add Score",
                    input: "number",
                    inputLabel: "Score",
                    inputPlaceholder: "Score",
                    showCancelButton: true,
                  }).then((res) => {
                    if (res.isConfirmed) {
                      const currentScore =
                        props.match.endResult &&
                        props.match.endResult.find(
                          (p) => p.id === params.row.id
                        )?.pointsGained;
                      const val = parseInt(res.value as string);
                      const final = val + (currentScore || 0);
                      axios
                        .post("/api/admin/matches/score", {
                          playerId: params.row.id,
                          matchId: props.match.id,
                          score: final,
                        })
                        .finally(() => {
                          window.location.reload();
                        });
                    }
                  });
                }}
              >
                <FaPlus />
              </Button>
              <Link
                href={`/admin/players/${params.row.id}`}
                className={"w-full h-full"}
              >
                <Button variant={"text"} className={"w-full h-full"}>
                  <FaEdit />
                </Button>
              </Link>
            </>
          );
        },
      },
    ];
  }, [props]);
  return (
    <AdminWrapper>
      <div className={"flex flex-col items-center justify-center"}>
        <h1 className={"text-4xl font-bold"}>Edit Match</h1>
        <Grid container className={"w-full pt-4"} spacing={2}>
          <Grid item xs={12} md={4}>
            <div className={"flex flex-col gap-4"}>
              <Card>
                <form
                  className={"flex flex-col gap-4"}
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <TextField
                    type={"text"}
                    id={"edit-map"}
                    name={"map"}
                    label={"Map"}
                    defaultValue={props.match.map}
                  />
                  <TextField
                    type={"text"}
                    id={"edit-description"}
                    name={"description"}
                    label={"Description"}
                    defaultValue={props.match.description}
                  />
                  <SelectPlayer
                    multiple
                    onChange={(val) => setPlayers(val)}
                    defaultValue={props.playerObjects}
                  />
                  <CustomButton
                    type={"submit"}
                    variant={"outlined"}
                    loading={loading}
                    onClickLoading={() => {
                      const values = getInputValues("edit");
                      const d = {
                        id: props.match.id,
                        ...values,
                        players,
                      };
                      return axios
                        .put(`/api/admin/matches/update`, d)
                        .finally(() => {
                          window.location.reload();
                        });
                    }}
                  >
                    Submit
                  </CustomButton>
                </form>
              </Card>
              <Card>
                <div className={"flex flex-col gap-4"}>
                  <CustomButton
                    variant={"outlined"}
                    className={"w-full h-full"}
                    disabled={currentMatch?.value === props.match.id}
                    onClickLoading={(e) => {
                      e.stopPropagation();
                      return setSettingClient(
                        "currentMatch",
                        props.match.id
                      ).finally(() => {
                        swrConfig.mutate(currentMatch.url);
                      });
                    }}
                  >
                    {currentMatch?.value === props.match.id
                      ? "Current"
                      : "Set Active"}
                  </CustomButton>
                  <CustomButton
                    variant={"outlined"}
                    className={"w-full"}
                    disabled={!!props.match.end}
                    onClickLoading={() => {
                      return axios
                        .post("/api/admin/matches/end", {
                          id: props.match.id,
                        })
                        .finally(() => {
                          props.match.end = new Date();
                        });
                    }}
                  >
                    {!props.match.end ? "End Match" : "Match Ended"}
                  </CustomButton>
                  <SelectWinner
                    defaultValue={props?.winner}
                    matchId={props.match.id}
                    players={props.playerObjects}
                  />
                </div>
              </Card>
            </div>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <div className={"flex flex-col gap-4"}>
                <h1 className={"text-2xl font-bold"}>Match Players</h1>
                <div className={`text-white w-full h-[70vh]`}>
                  <DataGrid
                    className={""}
                    columns={cols}
                    rows={props.playerObjects}
                    autoPageSize
                    pagination
                  />
                </div>
              </div>
            </Card>
          </Grid>
        </Grid>
      </div>
    </AdminWrapper>
  );
};

export default ModifyMatchPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;
  const match = await getMatch(id as string);
  if (!match) {
    return {
      notFound: true,
    };
  }
  const playerObjects = await getPlayersByIds(match.players);
  const winner = match.winner ? await getPlayer(match.winner) : undefined;
  return {
    props: {
      match,
      playerObjects,
      winner,
    },
  };
}
