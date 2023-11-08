import React from "react";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import AdminWrapper from "@/components/admin/wrapper";

const AdminPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return (
    <AdminWrapper>
      <div className={"flex flex-col items-center justify-center"}>
        <h1 className={"text-4xl font-bold"}>Admin</h1>
      </div>
    </AdminWrapper>
  );
};

export default AdminPage;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {},
  };
}
