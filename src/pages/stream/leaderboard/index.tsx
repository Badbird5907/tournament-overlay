import React from "react";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Players } from ".prisma/client";
import { getTopPlayers } from "@/prisma/players";
import { TranslucentCard } from "@/components/translucent-card";
import useSWR from "swr";
import { Table } from "@mui/material";

const LeaderboardPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { data, error, isLoading } = useSWR(props.endpoint, {
    refreshInterval: 1000,
    fallbackData: props.players,
  });

  return (
    <div
      className={`flex flex-col ${
        props.position === "center" ? "items-center justify-center" : ""
      } h-screen`}
    >
      <TranslucentCard
        enable={props.translucent}
        transparency={0.95}
        className={`rounded-lg w-1/4 ${
          props.position === "top-right"
            ? "right-0 top-0 absolute mr-2 mt-2"
            : ""
        }`}
      >
        <h1 className={"text-4xl font-bold text-center"}>
          {props.scope !== "all" ? "Match Players" : "Event Leaderboard"}
        </h1>
        <h1 className={"text-xl text-gray-500 text-center"}>
          {props.endpoint} ({props.scope})
        </h1>
        {/* for some odd reason the normal <table> element breaks the background transparency */}
        <Table>
          <thead>
            <tr>
              <th className={"text-2xl font-bold"}>Name</th>
              <th className={"text-2xl font-bold"}>Wins</th>
              <th className={"text-2xl font-bold"}>Losses</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              !error &&
              data &&
              (data as Players[]).map((player, i) => {
                return (
                  <tr key={i}>
                    <td className={"text-2xl"}>{player.name}</td>
                    <td className={"text-2xl"}>{player.wins}</td>
                    <td className={"text-2xl"}>{player.losses}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </TranslucentCard>
    </div>
  );
};

export default LeaderboardPage;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const translucent = context.query.translucent === "true";
  const max = context.query.max ? Number(context.query.max) : 10;
  const scope = context.query.scope || "all";
  const position = context.query.position || "center";
  return {
    props: {
      translucent,
      players: scope === "all" ? await getTopPlayers(max) : [],
      endpoint:
        scope === "all"
          ? "/api/leaderboard"
          : `/api/match/${scope}/leaderboard`,
      scope,
      position,
    },
  };
}
