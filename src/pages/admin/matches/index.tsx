import React from "react";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import AdminWrapper from "@/components/admin/wrapper";
import Matches from "@/components/admin/matches";

const MatchesPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return (
    <AdminWrapper>
      <div className={"flex flex-col items-center justify-center"}>
        <h1 className={"text-4xl font-bold"}>Matches</h1>
        <Matches initialQuery={props.initialQuery} />
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
