import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import AdminWrapper from "@/components/admin/wrapper";
import { Players } from ".prisma/client";
import axios from "axios";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { Card, Fab, Modal, TextField } from "@mui/material";
import { PaginatedResponse } from "@/types/pagination";
import { Button } from "@mui/material";
import { MdAdd, MdDelete } from "react-icons/md";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import CustomButton from "@/components/button";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";
import { DebounceInput } from "react-debounce-input";

export const playerCols = [
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
    field: "email",
    headerName: "Email",
    width: 220,
    sortable: false,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    sortable: false,
    renderCell: (params: GridRenderCellParams) => {
      return new Date(params.value as string).toLocaleString();
    },
  },
  {
    field: "points",
    headerName: "Points",
    width: 50,
    sortable: false,
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
];

const PlayersPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [query, setQuery] = useState<any>(props.initialQuery);
  const [players, setPlayers] = useState<
    PaginatedResponse<Players> | undefined
  >(undefined);
  const [selected, setSelected] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

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
            // window.location.href = "/admin/players/add";
            setModalOpen(true);
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
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <Card
          className={
            "p-4 w-1/3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          }
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const name = (e.target as any).name.value;
              const email = (e.target as any).email.value;
              const description = (e.target as any).description.value;
              axios
                .post("/api/admin/players/add", {
                  name,
                  email,
                  description,
                })
                .then((res) => {
                  setModalOpen(false);
                  Swal.fire({
                    title: "Success",
                    text: "Player added",
                    icon: "success",
                  }).then(() => {
                    // force refresh
                    setQuery({
                      ...query,
                      dummy: Math.random(),
                    });
                  });
                })
                .finally(() => {
                  setSubmitLoading(false);
                });
            }}
            className={"flex flex-col gap-4"}
          >
            <TextField
              id={"name"}
              label={"Name"}
              variant={"outlined"}
              className={"w-full"}
              required
            />
            <TextField
              id={"email"}
              label={"Email"}
              variant={"outlined"}
              className={"w-full"}
              required
              type={"email"}
            />
            <TextField
              id={"description"}
              label={"Description"}
              variant={"outlined"}
              className={"w-full"}
            />
            <CustomButton
              variant={"outlined"}
              className={"w-full py-3"}
              type={"submit"}
              loading={submitLoading}
            >
              Add
            </CustomButton>
          </form>
        </Card>
      </Modal>
      <div className={"flex flex-col items-center justify-center"}>
        <h1 className={"text-4xl font-bold"}>Players</h1>
        <div className={"w-full flex flex-row justify-center py-4"}>
          <DebounceInput
            debounceTimeout={300}
            onChange={(e) => {
              setQuery({ ...query, search: e.target.value });
            }}
            placeholder={"Search"}
            className={"w-full"}
            element={TextField}
          />
        </div>
        <div className={"text-white w-full h-[75vh]"}>
          <DataGrid
            columns={[
              ...playerCols,
              {
                field: "_dummy",
                headerName: "Actions",
                width: 200,
                sortable: false,
                renderCell: (params) => {
                  return (
                    <Link
                      href={`/admin/players/${params.row.id}`}
                      className={"w-full h-full"}
                    >
                      <Button variant={"text"} className={"w-full h-full"}>
                        <FaEdit />
                      </Button>
                    </Link>
                  );
                },
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
