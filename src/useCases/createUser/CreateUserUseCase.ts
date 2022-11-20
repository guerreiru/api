import { hash } from 'bcryptjs';
import { client } from '../../prisma/client';

interface IUserRequest {
  name: string;
  username: string;
  password: string;
}

class CreateUserUseCase {
  async execute({ name, username, password }: IUserRequest) {
    // Verificar se user existe
    const userAlreadyExists = await client.users.findFirst({
      where: {
        username,
      },
    });

    // Se já existir, lança um erro;
    if (userAlreadyExists) {
      throw new Error('Usuário já cadastrado.');
    }

    // Se não existir, cadastra o novo user;
    const passwordHash = await hash(password, 8);

    const user = await client.accounts.create({
      data: {
        balance: 100,
        user: {
          create: {
            username,
            password: passwordHash,
          }
        }
      }
    })

    return user;
  }
}

export { CreateUserUseCase };
