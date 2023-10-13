import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../../../../lib/prisma";

type CreateEventInput = {
  title: string;
  description: string;
  startAt: Date;
  endAt: Date;
  type: string;
  teamId: string;
};

export class EventRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create({
    title,
    description,
    startAt,
    endAt,
    type,
    teamId,
  }: CreateEventInput) {
    return await this.prisma.event.create({
      data: {
        title,
        description,
        startAt,
        endAt,
        type,
        teamId: teamId,
      },
    });
  }
}

const instance = new EventRepository(prismaClient);
export default instance;
