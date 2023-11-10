import React from "react";
import { PaginatedResponse } from "@/types/pagination";
import { Matches } from ".prisma/client";
import axios from "axios";
import AdminWrapper from "@/components/admin/wrapper";
import { TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DebounceInput } from "react-debounce-input";
const Matches = (props: { initialQuery: any; embedded?: boolean }) => {
  const [query, setQuery] = React.useState<any>(props.initialQuery);
  const [matches, setMatches] = React.useState<
    PaginatedResponse<Matches> | undefined
  >(undefined);

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
    <div>
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
  );
};

export default Matches;
