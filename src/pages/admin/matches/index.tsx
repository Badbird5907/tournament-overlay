import React, { useState } from "react";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import AdminWrapper from "@/components/admin/wrapper";
import Matches from "@/components/admin/matches";
import { GridToolbarContainer } from "@mui/x-data-grid";
import { Button, Card, Modal, TextField } from "@mui/material";
import { MdAdd, MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import CustomButton from "@/components/button";
import SelectPlayer from "@/components/admin/matches/select-player";
import SelectMap from "@/components/admin/matches/select-map";

const MatchesPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const Toolbar = () => {
    return (
      <GridToolbarContainer>
        <Button
          variant={"text"}
          startIcon={<MdAdd />}
          onClick={(e) => setModalOpen(true)}
        >
          Start
        </Button>
        <Button
          variant={"text"}
          color={"error"}
          startIcon={<MdDelete />}
          onClick={(e) => {
            Swal.fire({
              title: "Are you sure?",
              text: `You're about to delete ${selected.length} matche(s)`,
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
        <h1 className={"text-4xl font-bold"}>Matches</h1>
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
                const map = (e.target as any).map.value;
                const description = (e.target as any).description.value;
                setSubmitLoading(true);
                axios
                  .post("/api/admin/matches/start", {
                    map,
                    description,
                    players: selectedPlayers,
                  })
                  .then((res) => {
                    console.log({ res });
                    setSubmitLoading(false);
                    setModalOpen(false);
                    Swal.fire({
                      title: "Success",
                      text: "Match started",
                      icon: "success",
                    }).then(() => {
                      window.location.href = `/admin/matches/${res.data.id}`;
                    });
                  });
              }}
              className={"flex flex-col gap-4"}
            >
              <SelectMap />
              <SelectPlayer
                onChange={(val) => {
                  setSelectedPlayers(val);
                }}
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
                Start
              </CustomButton>
            </form>
          </Card>
        </Modal>
        <Matches initialQuery={props.initialQuery} toolbar={Toolbar} />
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
