import { Card } from "@mui/joy";
import { Bracket } from "react-brackets";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { TranslucentCard } from "@/components/translucent-card";

const BracketPage = ({
  translucent,
  fullscreen,
  rounds,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (fullscreen)
    return (
      <div className={"h-screen"}>
        <Bracket rounds={rounds} />
      </div>
    );
  return (
    <div className="flex flex-col items-center justify-center px-6 mx-auto h-screen">
      <TranslucentCard enable={translucent}>
        <Bracket rounds={rounds} />
      </TranslucentCard>
    </div>
  );
};

export default BracketPage;
export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const translucent = ctx.query.translucent === "true";
  const fullscreen = ctx.query.fullscreen === "true";
  return {
    props: {
      translucent,
      fullscreen,
      rounds: JSON.parse(
        JSON.stringify([
          {
            title: "Round one",
            seeds: [
              {
                id: 1,
                date: new Date().toDateString(),
                teams: [{ name: "Player 1" }, { name: "Player 2" }],
              },
              {
                id: 2,
                date: new Date().toDateString(),
                teams: [{ name: "Player 3" }, { name: "Player 4" }],
              },
            ],
          },
          {
            title: "Round one",
            seeds: [
              {
                id: 3,
                date: new Date().toDateString(),
                teams: [{ name: "Player 2" }, { name: "Player 3" }],
              },
            ],
          },
        ])
      ),
    },
  };
};
