export const getAllMatches = async () => {
  return prisma.matches.findMany({
    orderBy: {
      start: "desc",
    },
  });
};

export const getMatch = async (id: string) => {
  return prisma.matches.findUnique({
    where: {
      id,
    },
  });
};
