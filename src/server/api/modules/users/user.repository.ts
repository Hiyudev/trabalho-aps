import { type PrismaClient } from "@prisma/client";

export type UserRepositoryCreateInput = {
  name: string;
  email: string;
  password: string;
};

export type UserRepositoryUpdateInput = UserRepositoryCreateInput & {
  id: string;
};

export class UserRepository {
  constructor(private readonly client: PrismaClient) {}

  async create({
    name,
    email,
    password,
  }: UserRepositoryCreateInput) {
    const user = await this.client.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    return await this.client.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: string) {
    return await this.client.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update({
    id,
    name,
    email,
    password,
  }: UserRepositoryUpdateInput) {
    const user = await this.client.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        password,
      },
    });

    return user;
  }

  async delete(id: string) {
    await this.client.user.delete({
      where: {
        id,
      },
    });
  }
}
