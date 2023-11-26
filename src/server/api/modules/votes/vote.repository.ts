import { type PrismaClient } from "@prisma/client";
import { prismaClient } from "../../../../lib/prisma";

export class VoteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: any) {
    return await this.prisma.vote.create({
      data: {
        user: {
          connect: {
            id: data.userId,
          },
        },
        event: {
          connect: {
            id: data.eventId,
          },
        },
        confirmed: data.confirmed,
        excuse: data.excuse,
      },
    });
  }
}

const instance = new VoteRepository(prismaClient);
export default instance;
