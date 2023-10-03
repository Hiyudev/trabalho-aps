import { createTRPCRouter, publicProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  getAll: publicProcedure.query(() => {
    return [
      {
        id: "1",
        title: "Event 1",
        description: "Description of the event 1",
        type: "training",
        createdAt: new Date(),
        updatedAt: new Date(),
        startAt: new Date("2023-10-03"),
        endAt: new Date("2023-10-03"),
        teamId: "1"
      },
      {
        id: "2",
        title: "Event 2",
        description: "Description of the event 2",
        type: "championship",
        createdAt: new Date(),
        updatedAt: new Date(),
        startAt: new Date("2023-10-03"),
        endAt: new Date("2023-10-03"),
        teamId: "1"
      }
    ]
  }),
});
