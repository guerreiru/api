import { client } from '../../prisma/client';
import { getUserIdFromToken } from '../../utils/getTokenData';

class GetAccountBalanceUserCase {
  async execute(authToken: string) {
    const userId = getUserIdFromToken(authToken)
    // Verificar se user existe
    const user = await client.users.findFirst({
      where: {
        id: userId,
      },
      include: {
        account: true,
      }
    })

    // Se não existir, lança um erro;
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    const { balance } = user.account

    return balance;
  }
}

export { GetAccountBalanceUserCase };
