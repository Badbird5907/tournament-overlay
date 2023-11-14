import React from "react";
import { PaginatedResponse } from "@/types/pagination";
import { Matches } from ".prisma/client";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DebounceInput } from "react-debounce-input";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { setSettingClient, useCurrentMatch } from "@/util/client";
import CustomButton from "@/components/button";
import { useSWRConfig } from "swr";

const Matches = (props: {
  initialQuery: any;
  embedded?: boolean;
  toolbar?: React.JSXElementConstructor<any> | null | undefined;
}) => {
  const [query, setQuery] = React.useState<any>(props.initialQuery);
  const [matches, setMatches] = React.useState<
    PaginatedResponse<Matches> | undefined
  >(undefined);
  const currentMatch = useCurrentMatch();
  const swrConfig = useSWRConfig();

  React.useEffect(() => {
    const buildQueryUrl = () => {
      const params = new URLSearchParams(query);
      Object.keys(query).forEach((key) => {
        const val = query[key];
        if (val) {
          params.set(key, query[key]);
        } else {
          params.delete(key);
        }
      });
      return `/api/admin/matches/get?${params}`;
    };
    axios.get(buildQueryUrl()).then((res) => {
      setMatches(res.data);
    });
  }, [query]);
  return (
    <div className={"w-full"}>
      <div className={"w-full flex flex-row justify-center py-4"}>
        <DebounceInput
          debounceTimeout={300}
          onChange={(e) => {
            setQuery({ ...query, search: e.target.value });
          }}
          placeholder={"Search"}
          className={"w-full"}
          label={"Search"}
          element={TextField}
        />
      </div>
      <div
        className={`text-white w-full ${
          props.embedded ? "h-[60vh]" : "h-[75vh]"
        }`}
      >
        <DataGrid
          slots={{
            toolbar: props.toolbar,
          }}
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
              width: 250,
              sortable: false,
              renderCell: (params) => {
                return (
                  <div className={"flex gap-4 w-full h-full"}>
                    <Link
                      href={`/admin/matches/${params.row.id}`}
                      className={"w-full h-full"}
                    >
                      <Button variant={"outlined"} className={"w-full h-full"}>
                        <FaEdit />
                      </Button>
                    </Link>
                    <CustomButton
                      variant={"outlined"}
                      className={"w-full h-full"}
                      disabled={currentMatch?.value === params.row.id}
                      onClickLoading={(e) => {
                        e.stopPropagation();
                        return setSettingClient(
                          "currentMatch",
                          params.row.id
                        ).finally(() => {
                          swrConfig.mutate(currentMatch.url);
                        });
                      }}
                    >
                      {currentMatch?.value === params.row.id
                        ? "Current"
                        : "Set Active"}
                    </CustomButton>
                  </div>
                );
              },
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
  );
};

export default Matches;
