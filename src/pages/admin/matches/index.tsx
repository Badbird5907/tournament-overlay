import React from "react";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import AdminWrapper from "@/components/admin/wrapper";
import { Matches } from ".prisma/client";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Fab, TextField } from "@mui/material";
import { PaginatedResponse } from "@/types/pagination";
import { FaPlus } from "react-icons/fa";

const MatchesPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [query, setQuery] = React.useState<any>(props.initialQuery);
  const [matches, setMatches] = React.useState<
    PaginatedResponse<Matches> | undefined
  >(undefined);

  React.useEffect(() => {
    const buildQueryUrl = () => {
      const params = new URLSearchParams(query);
      const browserParams = new URLSearchParams();
      Object.keys(query).forEach((key) => {
        const val = query[key];
        if (val) {
          params.set(key, query[key]);
          browserParams.set(key, query[key]);
        } else {
          params.delete(key);
          browserParams.delete(key);
        }
        if ((key === "limit" && val === 8) || (key === "page" && val === 1))
          browserParams.delete(key);
      });
      // set query params on url
      const param = browserParams.toString();
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}${param && "?"}${param}`
      );
      return `/api/admin/matches/get?${params}`;
    };
    const url = buildQueryUrl();
    axios.get(url).then((res) => {
      setMatches(res.data);
    });
  }, [query]);
  return (
    <AdminWrapper>
      <div className={"flex flex-col items-center justify-center"}>
        <h1 className={"text-4xl font-bold"}>Matches</h1>
        <div className={"w-full flex flex-row justify-center py-4"}>
          <TextField
            placeholder={"Search"}
            className={"w-full"}
            onChange={(e) => {
              setQuery({ ...query, search: e.target.value });
            }}
          />
        </div>
        <div style={{ height: "78vh", width: "100%" }} className={"text-white"}>
          <DataGrid
            columns={[
              {
                field: "id",
                headerName: "ID",
                width: 230,
                sortable: false,
              },
              {
                field: "description",
                headerName: "Description",
                width: 180,
                sortable: false,
              },
              {
                field: "map",
                headerName: "Map",
                width: 150,
                sortable: false,
              },
              {
                field: "start",
                headerName: "Start",
                width: 200,
                sortable: false,
                renderCell: (params) => {
                  return new Date(params.value as string).toLocaleString();
                },
              },
              {
                field: "end",
                headerName: "End",
                width: 200,
                sortable: false,
                renderCell: (params) => {
                  if (!params.value) return "N/A";
                  return new Date(params.value as string).toLocaleString();
                },
              },
              {
                field: "_dummy",
                headerName: "Actions",
                width: 200,
                sortable: false,
              },
            ]}
            rows={matches?.data || []}
            rowCount={matches?.maxSize}
            pagination
            paginationModel={{
              page: query.page - 1,
              pageSize: query.limit || 8,
            }}
            onPaginationModelChange={(change) => {
              setQuery({
                ...query,
                page: change.page + 1,
                limit: change.pageSize,
              });
            }}
            paginationMode={"server"}
            loading={!matches}
          />
        </div>
      </div>
    </AdminWrapper>
  );
};

export default MatchesPage;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      initialQuery: {
        page: context.query.page || 1,
        limit: context.query.limit || 8,
        search: context.query.search || "",
      },
    },
  };
}
