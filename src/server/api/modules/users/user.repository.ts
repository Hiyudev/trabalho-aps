import { type PrismaClient } from "@prisma/client";
import { prismaClient } from "../../../../lib/prisma";

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getWithDetails(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        participates: {
          include: {
            team: true,
          }
        },
      },
    });
  }
}

const instance = new UserRepository(prismaClient);
export default instance;
