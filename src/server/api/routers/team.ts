import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const teamRouter = createTRPCRouter({
  getAll: publicProcedure.query(() => {
    return [
      {
        id: "1",
        name: "Team 1",
        icon: "https://placehold.co/512x512/orange/white.png",
        description: "O melhor time do bairro",
        invite: "49849849",
      },
      {
        id: "2",
        name: "Team 2",
        icon: "https://placehold.co/512x512/green/white.png",
        description: "O melhor time da história",
        invite: "49849849",
      },
    ];
  }),
});
