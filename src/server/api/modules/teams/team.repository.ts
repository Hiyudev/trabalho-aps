import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../../../../lib/prisma";

type CreateTeamInput = {
  userId: string;
  name: string;
  description: string;
};

type UpdateTeamInput = Omit<CreateTeamInput, "userId">;

export class TeamRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create({ name, description, userId }: CreateTeamInput) {
    return await this.prisma.team.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId,
            role: "OWNER"
          }
        }
      }
    });
  }

  async getByIdWithDetails(id: string) {
    return await this.prisma.team.findUnique({
      where: {
        id
      },
      include: {
        events: {
          include: {
            votes: true,
          }
        },
        receipts: {
          include: {
            user: true,
          }
        },
        members: {
          include: {
            user: true,
          }
        }
      }
    });
  }

  async getAllUsersById(teamId: string) {
    return await this.prisma.team.findUnique({
      where: {
        id: teamId,
      },
      include: {
        members: {
          include: {
            user: true,
          }
        }
      }
    });
  }

  async getAllByUserId(userId: string) {
    return await this.prisma.team.findMany({
      where: {
        members: {
          some: {
            id: userId,
          }
        }
      }
    });
  }

  async update(id: string, { name, description }: UpdateTeamInput) {
    return await this.prisma.team.update({
      where: {
        id
      },
      data: {
        name,
        description
      }
    });
  }

  async remove(id: string) {
    return await this.prisma.team.delete({
      where: {
        id,
      }
    });
  }
}

const instance = new TeamRepository(prismaClient);
export default instance;
