import React from "react";

import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

const MatchViewPage = ({
  players,
  ...props
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="relative text-white h-screen w-screen">
      {/*
      <div className="absolute top-0 left-0 p-4">
        <TranslucentCard>
          <h1 className="text-4xl font-bold">YMCI MKT</h1>
        </TranslucentCard>
      </div>
      */}
      <div
        className={`absolute top-0 left-0 right-0 h-40 ${
          !props.solid && " bg-opacity-80"
        } bg-black flex items-center justify-between px-10`}
      >
        <div className="flex items-center gap-4">
          <img
            alt="Player 1 Avatar"
            className="rounded-full object-cover hidden"
            height="50"
            src="/placeholder.svg"
            style={{
              aspectRatio: "50/50",
              objectFit: "cover",
            }}
            width="50"
          />
          <div>
            <h2 className="text-4xl font-semibold">{players[0].name}</h2>
            <p className="text-2xl text-gray-400 font-bold">
              {players[0].description}
            </p>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-6xl font-bold">
            {players[0].score} - {players[1].score}
          </h3>
          <p className="text-2xl text-gray-400 font-bold">Current Score</p>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-4xl font-semibold">{players[1].name}</h2>
            <p className="text-2xl text-gray-400 font-bold">
              {players[1].description}
            </p>
          </div>
          <img
            alt="Player 2 Avatar"
            className="rounded-full object-cover hidden"
            height="50"
            src="/placeholder.svg"
            style={{
              aspectRatio: "50/50",
              objectFit: "cover",
            }}
            width="50"
          />
        </div>
      </div>
    </div>
  );
};

export default MatchViewPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      solid: context.query.solid === "true",
      players: [
        {
          id: 1,
          name: "Player 1",
          description: "Lorem Ipsum",
          score: 6,
        },
        {
          id: 2,
          name: "Player 2",
          description: "Lorem Ipsum",
          score: 9,
        },
      ],
    },
  };
}
