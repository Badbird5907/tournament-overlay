import React from "react";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import AdminWrapper from "@/components/admin/wrapper";

const AdminPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return (
    <AdminWrapper>

    </AdminWrapper>
  );
};

export default AdminPage;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {},
  };
}
