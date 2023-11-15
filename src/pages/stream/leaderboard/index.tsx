import React from "react";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Players } from ".prisma/client";
import { getTopPlayers } from "@/prisma/players";
import { TranslucentCard } from "@/components/translucent-card";
import useSWR from "swr";
import { Table } from "@mui/material";
import axios from "axios";
import { getAverageTopPlayers } from "@/prisma/matches";

const LeaderboardPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [lastUpdated, setLastUpdated] = React.useState<number>(0);
  const { data, error, isLoading } = useSWR(props.endpoint, {
    refreshInterval: 25,
    fallbackData: props.players,
    fetcher: (url) => {
      setLastUpdated(Date.now());
      return axios.get(url).then((res) => res.data);
    },
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
        className={`rounded-lg w-1/2 ${
          props.position === "top-right"
            ? "right-0 top-0 absolute mr-2 mt-2"
            : ""
        }`}
      >
        <h1 className={"text-4xl font-bold text-center"}>
          {props.scope !== "all" ? "Match Players" : "Event Leaderboard"}
        </h1>
        <h2 className={"text-2xl text-center text-gray-500"}>
          Ordered By Average
        </h2>
        {/*
        <h1 className={"text-xl text-gray-500 text-center"}>
          {props.endpoint} ({props.scope})
        </h1>
        */}
        {/* for some odd reason the normal <table> element breaks the background transparency */}
        <Table className={"w-full"}>
          <thead>
            <tr>
              <th className={"text-2xl font-bold"}>Name</th>
              <th className={"text-2xl font-bold"}>AVG Points</th>
              <th className={"text-2xl font-bold"}>Points</th>
              <th className={"text-2xl font-bold"}>Wins</th>
              <th className={"text-2xl font-bold"}>Played</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              !error &&
              data &&
              (data as (Players & { averagePoints: number })[])
                .filter((p) => p.points)
                .map((player, i) => {
                  const top6 = i < 6;
                  return (
                    <tr key={i} className={`w-full`}>
                      <td className={`text-2xl ${top6 && "text-yellow-500"}`}>
                        {player.name}
                      </td>
                      <td className={`text-2xl ${top6 && "text-yellow-500"}`}>
                        {player.averagePoints.toFixed(2)}
                      </td>
                      <td className={`text-2xl ${top6 && "text-yellow-500"}`}>
                        {player.points}
                      </td>
                      <td className={`text-2xl ${top6 && "text-yellow-500"}`}>
                        {player.wins}
                      </td>
                      <td className={`text-2xl ${top6 && "text-yellow-500"}`}>
                        {player.wins + player.losses}
                      </td>
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
      players: scope === "all" ? await getAverageTopPlayers(max) : [],
      endpoint:
        scope === "all"
          ? "/api/leaderboard"
          : `/api/match/${scope}/leaderboard`,
      scope,
      position,
    },
  };
}
