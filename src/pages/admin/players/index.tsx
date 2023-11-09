import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import AdminWrapper from "@/components/admin/wrapper";
import { Players } from ".prisma/client";
import axios from "axios";
import {
  DataGrid,
  GridRowSelectionModel,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Fab, TextField } from "@mui/material";
import { PaginatedResponse } from "@/types/pagination";
import { Button } from "@mui/material";
import { MdAdd, MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const PlayersPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [query, setQuery] = useState<any>(props.initialQuery);
  const [players, setPlayers] = useState<
    PaginatedResponse<Players> | undefined
  >(undefined);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
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
      return `/api/admin/players/get?${params}`;
    };
    const url = buildQueryUrl();
    axios.get(url).then((res) => {
      setPlayers(res.data);
    });
  }, [query]);
  const Toolbar = () => {
    return (
      <GridToolbarContainer>
        <Button
          variant={"text"}
          startIcon={<MdAdd />}
          onClick={(e) => {
            window.location.href = "/admin/players/add";
          }}
        >
          Add
        </Button>
        <Button
          variant={"text"}
          color={"error"}
          startIcon={<MdDelete />}
          onClick={(e) => {
            Swal.fire({
              title: "Are you sure?",
              text: `You're about to delete ${selected.length} player(s)`,
              icon: "warning",
              showCancelButton: true,
            }).then((res) => {
              if (res.isConfirmed) {
                axios
                  .post("/api/admin/players/delete", {
                    ids: selected,
                  })
                  .then(() => {
                    Swal.fire({
                      title: "Success",
                      text: "Players deleted",
                      icon: "success",
                    }).then(() => {
                      window.location.reload();
                    });
                  })
                  .catch((e) => {
                    Swal.fire({
                      title: "Error",
                      text: e.response.data.message,
                      icon: "error",
                    });
                  });
              }
            });
          }}
          disabled={!selected || !selected.length}
        >
          Delete
        </Button>
      </GridToolbarContainer>
    );
  };
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
          {/*
          <CustomButton
            variant={"solid"}
            className={"bg-blue-400 transition-all ml-2"}
          >
            Add
          </CustomButton>
          */}
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
                field: "name",
                headerName: "Name",
                width: 200,
                sortable: false,
              },
              {
                field: "description",
                headerName: "Description",
                width: 300,
                sortable: false,
              },
              {
                field: "createdAt",
                headerName: "Created At",
                width: 200,
                sortable: false,
                renderCell: (params) => {
                  return new Date(params.value as string).toLocaleString();
                },
              },
              {
                field: "wins",
                headerName: "Wins",
                width: 50,
                sortable: false,
              },
              {
                field: "losses",
                headerName: "Losses",
                width: 50,
                sortable: false,
              },
              {
                field: "_dummy",
                headerName: "Actions",
                width: 200,
                sortable: false,
              },
            ]}
            rows={players?.data || []}
            rowCount={players?.maxSize}
            checkboxSelection
            onRowSelectionModelChange={(e: GridRowSelectionModel) => {
              setSelected(e as string[]);
            }}
            autoPageSize
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
            loading={!players}
            pageSizeOptions={[5, 10, 15, 20, 25]}
            slots={{
              toolbar: Toolbar,
            }}
          />
        </div>
      </div>
    </AdminWrapper>
  );
};

export default PlayersPage;
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
