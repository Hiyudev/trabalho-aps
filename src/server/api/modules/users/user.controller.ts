import { createTRPCRouter, publicProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import userRepository from "./user.repository";

export class UserController {
  static create() {
    const route = createTRPCRouter({
      getWithDetails: publicProcedure
        .input(
          z.object({
            id: z.string(),
          }),
        )
        .query(async (opts) => {
          const userWithDetails = await userRepository.getWithDetails(opts.input.id);

          if (!userWithDetails) {
            throw new TRPCError({
              message: "User not found",
              code: "NOT_FOUND",
            });
          }

          const user = {
            id: userWithDetails.id,
            name: userWithDetails.name,
            email: userWithDetails.email,
            teams: userWithDetails.teams.map((participates) => {
              return {
                id: participates.team.id,
                name: participates.team.name,
                description: participates.team.description,
                role: participates.role,
                createdAt: participates.team.createdAt,
                updatedAt: participates.team.updatedAt,
                invite: participates.team.invite,
              };
            }),
          };

          return user;
        }),
    });

    return route;
  }
}
