import {
  createTRPCRouter,
  publicProcedure,
} from "../../trpc";
import { z } from "zod";
import eventRepository from "./event.repository";

export class EventController {
  static create() {
    const route = createTRPCRouter({
      create: publicProcedure
        .input(
          z.object({
            title: z.string(),
            description: z.string(),
            startAt: z.date(),
            endAt: z.date(),
            type: z.string(),
            teamId: z.string(),
          }),
        )
        .output(
          z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
            type: z.string(),
            startAt: z.date(),
            endAt: z.date(),
            createdAt: z.date(),
            updatedAt: z.date(),
            teamId: z.string(),
          }),
        )
        .mutation(async (opts) => {
          const event = await eventRepository.create({
            title: opts.input.title,
            description: opts.input.description,
            startAt: opts.input.startAt,
            endAt: opts.input.endAt,
            type: opts.input.type,
            teamId: opts.input.teamId,
          });

          return event
        }),
    });

    return route;
  }
}
