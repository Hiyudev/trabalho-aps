import { EventController } from "../modules/events/event.controller";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const eventRouter = EventController.create();
