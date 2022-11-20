import { sign } from 'jsonwebtoken';
import { client } from '../prisma/client';

class GenerateTokenProvider {
  async execute(userId: string) {

    const userData = await client.users.findFirst({
      where: {
        id: userId
      },
      include: {
        account: true
      }
    })

    const userFormatted = {
      id: userId,
      username: userData?.username,
      balance: userData?.account.balance
    }

    const token = sign({ user: userFormatted }, '33779428-f03f-4f4f-929d-b1db7d8441d0', {
      subject: userId,
      expiresIn: '24h',
    });

    return token;
  }
}

export { GenerateTokenProvider };
