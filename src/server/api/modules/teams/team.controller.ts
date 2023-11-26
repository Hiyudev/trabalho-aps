import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { z } from "zod";
import teamRepository from "./team.repository";
import userRepository from "../users/user.repository";

export class TeamController {
  static create() {
    const route = createTRPCRouter({
      create: publicProcedure
        .input(
          z.object({
            userId: z.string(),
            name: z.string(),
            description: z.string(),
          }),
        )
        .output(
          z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            createdAt: z.date(),
            updatedAt: z.date(),
            invite: z.string(),
          }),
        )
        .mutation(async (opts) => {
          const team = await teamRepository.create(opts.input);

          return team;
        }),
      getAll: publicProcedure
        .input(z.object({ userId: z.string() }))
        .output(
          z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              description: z.string(),
            }),
          ),
        )
        .query(async (opts) => {
          const teams = await teamRepository.getAllByUserId(opts.input.userId);

          return teams;
        }),
      getById: publicProcedure
        .input(
          z.object({
            id: z.string(),
          }),
        )
        .output(
          z.nullable(
            z.object({
              id: z.string(),
              name: z.string(),
              description: z.string(),
              createdAt: z.date(),
              updatedAt: z.date(),
              invite: z.string(),
              events: z.array(
                z.object({
                  id: z.string(),
                  title: z.string(),
                  description: z.string(),
                  startAt: z.date(),
                  endAt: z.date(),
                  createdAt: z.date(),
                  updatedAt: z.date(),
                  teamId: z.string(),
                  type: z.string(),
                  votes: z.array(
                    z.object({
                      id: z.string(),
                      confirmed: z.boolean(),
                      excuse: z.string().nullable(),
                      userId: z.string(),
                      eventId: z.string(),
                    }),
                  ),
                }),
              ),
              receipts: z.array(
                z.object({
                  id: z.string(),
                  money: z.number(),
                  userId: z.string(),
                  teamId: z.string(),
                  user: z.object({
                    id: z.string(),
                    name: z.string(),
                    email: z.string(),
                  }),
                  paid: z.boolean(),
                  startAt: z.date(),
                  endAt: z.date(),
                  createdAt: z.date(),
                  updatedAt: z.date(),
                }),
              ),
              members: z.array(
                z.object({
                  id: z.string(),
                  role: z.string(),
                  userId: z.string(),
                  teamId: z.string(),
                  user: z.object({
                    id: z.string(),
                    name: z.string(),
                    email: z.string(),
                  }),
                }),
              ),
            }),
          ),
        )
        .query(async (opts) => {
          const team = await teamRepository.getByIdWithDetails(opts.input.id);
          if(!team) return null;
          return team
        }),
      update: protectedProcedure
        .input(
          z.object({
            team: z.object({
              id: z.string(),
              name: z.string(),
              description: z.string(),
            }),
            userId: z.string(),
          }),
        )
        .output(
          z.object({
            success: z.boolean(),
          }),
        )
        .mutation(async (opts) => {
          const user = await userRepository.getWithDetails(opts.input.userId);

          if (!user) {
            return {
              success: false,
            };
          }

          const userIsOwner = user.participates.some(
            (participates) =>
              participates.team.id === opts.input.team.id &&
              participates.role.toLowerCase() === "owner",
          );

          if (!userIsOwner) {
            return {
              success: false,
            };
          }

          await teamRepository.update(opts.input.team.id, opts.input.team);

          return {
            success: true,
          };
        }),
      remove: protectedProcedure
        .input(z.object({ teamId: z.string(), userId: z.string() }))
        .output(
          z.object({
            success: z.boolean(),
          }),
        )
        .mutation(async (opts) => {
          const user = await userRepository.getWithDetails(opts.input.userId);

          if (!user) {
            return {
              success: false,
            };
          }

          const userIsOwner = user.participates.some(
            (participates) =>
              participates.team.id === opts.input.teamId &&
              participates.role.toLowerCase() === "owner",
          );

          if (!userIsOwner) {
            return {
              success: false,
            };
          }

          await teamRepository.remove(opts.input.teamId);

          return {
            success: true,
          };
        }),
    });

    return route;
  }
}
