import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../../../../lib/prisma";

type CreateReceiptInput = {
  startAt: Date;
  endAt: Date;
  createdAt: Date;
  updatedAt: Date;
  money: number;
  teamId: string;
  userId: string;
};

export class ReceiptRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async create({
    startAt,
    endAt,
    createdAt,
    updatedAt,
    money,
    teamId,
    userId,
  }: CreateReceiptInput) {
    return await this.prisma.receipt.create({
      data: {
        startAt,
        endAt,
        createdAt,
        updatedAt,
        money,
        teamId: teamId,
        userId: userId,
        paid: false,
      },
    });
  }

  async createMany(data: CreateReceiptInput[]){
    const receipts = await this.prisma.$transaction(data.map((receipt) => {
        return this.prisma.receipt.create({
            data: receipt,
            include: {
                user: true,
            }
        });
    }))

    return receipts;
  }

}

const instance = new ReceiptRepository(prismaClient);
export default instance;