import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "../lib/prisma";
import { use } from "react";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    console.log("Not logged in");
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    include: { workspaces: true },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await prisma.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      workspaces: {
        create: {
          name: "Personal",
          inviteCode: crypto.randomUUID(),
        },
      },
    },
    include: { workspaces: true },
  });
  return newProfile;
};
