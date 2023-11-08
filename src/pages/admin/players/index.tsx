import React from "react";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import AdminWrapper from "@/components/admin/wrapper";
import { Players } from ".prisma/client";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { TextField } from "@mui/material";

const PlayersPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [query, setQuery] = React.useState<any>({ limit: 8 });
  const [players, setPlayers] = React.useState<Players[]>([]);

  React.useEffect(() => {
    const buildQueryUrl = () => {
      const params = new URLSearchParams(query);
      Object.keys(query).forEach((key) => {
        params.set(key, query[key]);
      });
      return `/api/admin/players/get?${params.toString()}`;
    };
    axios.get(buildQueryUrl()).then((res) => {
      setPlayers(res.data.players);
    });
  }, [query]);
  return (
    <AdminWrapper>
      <div className={"flex flex-col items-center justify-center"}>
        <h1 className={"text-4xl font-bold"}>Players</h1>
        <div className={"w-full flex flex-row justify-center py-4"}>
          <TextField
            placeholder={"Search"}
            className={"w-full"}
            onChange={(e) => {
              setQuery({ ...query, search: e.target.value });
            }}
          />
        </div>
        <div style={{ height: "75vh", width: "100%" }} className={"text-white"}>
          <DataGrid
            columns={[
              {
                field: "id",
                headerName: "ID",
                width: 230,
              },
              {
                field: "name",
                headerName: "Name",
                width: 200,
              },
              {
                field: "description",
                headerName: "Description",
                width: 300,
              },
              {
                field: "createdAt",
                headerName: "Created At",
                width: 200,
                renderCell: (params) => {
                  return new Date(params.value as string).toLocaleString();
                },
              },
              {
                field: "wins",
                headerName: "Wins",
                width: 50,
              },
              {
                field: "losses",
                headerName: "Losses",
                width: 50,
              },
              {
                field: "_dummy",
                headerName: "Actions",
                width: 200,
              },
            ]}
            rows={players}
          />
        </div>
      </div>
    </AdminWrapper>
  );
};

export default PlayersPage;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {},
  };
}
