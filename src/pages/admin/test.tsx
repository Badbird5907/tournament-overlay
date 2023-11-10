import React from "react";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import AdminWrapper from "@/components/admin/wrapper";
import CustomButton from "@/components/button";

const TestPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return (
    <AdminWrapper>
      <CustomButton variant={"solid"}>Hi</CustomButton>
    </AdminWrapper>
  );
};

export default TestPage;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {},
  };
}
