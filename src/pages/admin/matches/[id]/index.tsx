import React from "react";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import AdminWrapper from "@/components/admin/wrapper";
import { Grid, TextField } from "@mui/material";
import Card from "@/components/card";
import { getMatch } from "@/prisma/matches";
import { getInputValues } from "@/util/client";
import axios from "axios";

const ModifyMatchPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return (
    <AdminWrapper>
      <div className={"flex flex-col items-center justify-center"}>
        <h1 className={"text-4xl font-bold"}>Edit Match</h1>
        <Grid container className={"w-full pt-4"} spacing={2}>
          <Grid item xs={12} md={4}>
            <div className={"flex flex-col"}>
              <Card>
                <form
                  className={"flex flex-col gap-4"}
                  onSubmit={(e) => {
                    e.preventDefault();
                    const values = getInputValues("edit");
                    axios.put(`/api/admin/matches/update`, {
                      id: props.match.id,
                      ...values,
                    });
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
                </form>
              </Card>
            </div>
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
  return {
    props: {
      match,
    },
  };
}
