import { createTRPCRouter, publicProcedure } from "../../trpc";
import { UserFactory } from "./factories/user.factory";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export class UserController {
  static create() {
    const { loginUseCase, registerUseCase } = UserFactory.create();

    const route = createTRPCRouter({
      register: publicProcedure
        .input(
          z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string(),
          }),
        )
        .output(
          z.object({
            token: z.string(),
            name: z.string(),
            email: z.string().email(),
          }),
        )
        .mutation(async (opts) => {
          try {
            const user = await registerUseCase.execute(opts.input);

            return user;
          } catch (err) {
            if (err instanceof Error) {
              throw new TRPCError({
                message: err.message,
                code: "BAD_REQUEST",
              });
            }

            throw err;
          }
        }),
      login: publicProcedure
        .input(
          z.object({
            email: z.string().email(),
            password: z.string(),
          }),
        )
        .output(
          z.object({
            token: z.string(),
            id: z.string(),
            name: z.string(),
            email: z.string().email(),
          }),
        )
        .mutation(async (opts) => {
          try {
            const user = await loginUseCase.execute(opts.input);

            return user;
          } catch (err) {
            if (err instanceof Error) {
              throw new TRPCError({
                message: err.message,
                code: "BAD_REQUEST",
              });
            }

            throw err;
          }
        }),
    });

    return route;
  }
}
