import { prismaClient } from "../../../../../lib/prisma";
import { LoginUseCase } from "../usecases/login.usecase";
import { RegisterUseCase } from "../usecases/register.usecase";
import { UserRepository } from "../user.repository";

export class UserFactory {
  static create() {
    const userRepository = new UserRepository(prismaClient);

    const loginUseCase = new LoginUseCase(userRepository);
    const registerUseCase = new RegisterUseCase(userRepository);

    return {
      loginUseCase,
      registerUseCase,
    };
  }
}
