import React from "react";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import AdminWrapper from "@/components/admin/wrapper";
import { Button, Card, Grid, TextField } from "@mui/material";

const AddPlayerPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return (
    <AdminWrapper>
      <div className={"flex flex-col items-center justify-center w-full"}>
        <h1 className={"text-4xl font-bold text-center"}>Add Player</h1>
        {/* Need: name, email, description (optional) */}
        <Card className={"p-4 w-1/2"}>
          <form>
            <TextField
              label={"Name"}
              variant={"outlined"}
              className={"w-full mb-4"}
              required
            />
            <TextField
              label={"Email"}
              variant={"outlined"}
              className={"w-full mb-4"}
              required
            />
            <TextField
              label={"Description"}
              variant={"outlined"}
              className={"w-full mb-4"}
            />
            <Button
              variant={"outlined"}
              className={"w-full py-3"}
              type={"submit"}
            >
              Add
            </Button>
          </form>
        </Card>
      </div>
    </AdminWrapper>
  );
};

export default AddPlayerPage;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {},
  };
}
