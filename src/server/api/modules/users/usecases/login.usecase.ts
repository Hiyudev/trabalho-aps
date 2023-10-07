import { type UserRepository } from "../user.repository";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export type LoginUseCaseInput = {
  email: string;
  password: string;
};

export class LoginUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ email, password }: LoginUseCaseInput) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Senha inválida");
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      },
    );

    return {
      token,
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
