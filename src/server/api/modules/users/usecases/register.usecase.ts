import { type UserRepository } from "../user.repository";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export type RegisterUseCaseInput = {
  name: string;
  email: string;
  password: string;
};

export class RegisterUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ name, email, password }: RegisterUseCaseInput) {
    const hasUser = await this.userRepository.findByEmail(email);

    if (hasUser) {
      throw new Error("Usuário já existe");
    }

    const hashedPassword = bcrypt.hashSync(
      password,
      parseInt(process.env.SALT_ROUNDS!, 10),
    );

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

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
      name: user.name,
      email: user.email,
    };
  }
}
