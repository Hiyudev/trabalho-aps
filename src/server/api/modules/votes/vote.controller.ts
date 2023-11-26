import { createTRPCRouter, publicProcedure } from "../../trpc";
import { z } from "zod";
import voteRepository from "./vote.repository";

export class VoteController {
  static create() {
    const route = createTRPCRouter({
      create: publicProcedure
        .input(
          z.object({
            userId: z.string(),
            eventId: z.string(),
            confirmed: z.boolean(),
            excuse: z.string().optional(),
          }),
        )
        .output(
          z.object({
            id: z.string(),
            userId: z.string(),
            eventId: z.string(),
            confirmed: z.boolean(),
            excuse: z.string().nullable(),
          }),
        )
        .mutation(async (opts) => {
          const vote = await voteRepository.create(opts.input);
          return vote
        }),
    });

    return route;
  }
}
