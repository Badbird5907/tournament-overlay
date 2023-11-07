import prisma from "@/prisma/index";

export const getSetting = async (key: string, defaultValue?: any) => {
  const data = await prisma.settings.findUnique({
    where: {
      key,
    },
  });
  return data?.value ?? defaultValue;
};

export const setSetting = async (key: string, value: any) => {
  return prisma.settings.upsert({
    where: {
      key,
    },
    update: {
      value,
    },
    create: {
      key,
      value,
    },
  });
};
