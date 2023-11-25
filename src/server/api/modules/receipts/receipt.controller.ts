import {
    createTRPCRouter,
    publicProcedure,
  } from "../../trpc";
import { z } from "zod";
import receiptRepository from "./receipt.repository";
import teamRepository from "../teams/team.repository";
import { TRPCError } from "@trpc/server";

export class ReceiptController {
  static create() {
    const route = createTRPCRouter({
      create: publicProcedure
        .input(
          z.object({
            startAt: z.date(),
            endAt: z.date(),
            createdAt: z.date(),
            updatedAt: z.date(),
            money: z.number(),
            teamId: z.string(),
            userId: z.string(),
            paid: z.boolean(),
          }),
        )
        .output(
          z.object({
            startAt: z.date(),
            endAt: z.date(),
            createdAt: z.date(),
            updatedAt: z.date(),
            money: z.number(),
            teamId: z.string(),
            userId: z.string(),
            paid: z.boolean(),
          }),
        )
        .mutation(async (opts) => {
          const receipt = await receiptRepository.create(opts.input);
          return receipt;
        }),
      createForAllUserMembers: publicProcedure.input(
          z.object({
            startAt: z.date(),
            endAt: z.date(),
            createdAt: z.date(),
            updatedAt: z.date(),
            money: z.number(),
            teamId: z.string(),
          })
        ).output(
          z.array(
            z.object({
              startAt: z.date(),
              endAt: z.date(),
              createdAt: z.date(),
              updatedAt: z.date(),
              money: z.number(),
              teamId: z.string(),
              userId: z.string(),
              paid: z.boolean(),
              user: z.object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
              }),
            }),
          )
        ).mutation(async (opts) => {
          const team = await teamRepository.getAllUsersById(opts.input.teamId)
          if(!team) {
            throw new TRPCError({
              message: "Team not found",
              code: "NOT_FOUND",
            });
          }

          const usersIds = team.members.map((member) => {
            return member.userId;
          })

          const data = usersIds.map((userId) => ({
            startAt: opts.input.startAt,
            endAt: opts.input.endAt,
            createdAt: opts.input.createdAt,
            updatedAt: opts.input.updatedAt,
            money: opts.input.money,
            teamId: opts.input.teamId,
            userId: userId,
            paid: false,
          }))

 
         const receipts = receiptRepository.createMany(data);
         return receipts;
        })
    })
        
    return route;
  }
}