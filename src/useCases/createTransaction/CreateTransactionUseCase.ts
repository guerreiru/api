import { client } from '../../prisma/client';
import { getUserIdFromToken } from '../../utils/getTokenData';

interface ITransactionRequest {
  authToken: string | undefined;
  creditedUsername: string;
  value: number;
}

class CreateTransactionUseCase {
  async execute({ authToken, creditedUsername, value }: ITransactionRequest) {
    const userId = getUserIdFromToken(authToken)

    const debitedUser = await client.users.findFirst({
      where: {
        id: userId,
      },
      include: {
        account: true
      }
    })

    const creditedUser = await client.users.findFirst({
      where: {
        username: creditedUsername,
      },
      include: {
        account: true
      },
    })

    if (!debitedUser?.username || !creditedUser?.username) {
      throw new Error('Ambos os usuários devem ser válidos.');
    } else if (debitedUser.account.balance < value) {
      throw new Error('Você não possui saldo suficiente.');
    } else if (value <= 0) {
      throw new Error('Valor da transferência é inválido.');
    } else if (debitedUser.username === creditedUsername) {
      throw new Error('Você não pode fazer transferências para si mesmo.');
    }

    const transaction = await client.transactions.create({
      data: {
        fk_debited_account_id: debitedUser.fk_account_id,
        fk_credited_account_id: creditedUser.fk_account_id,
        value: Number(value),
        created_at: new Date()
      }
    })

    if (debitedUser && transaction) {
      await client.accounts.update({
        where: {
          id: debitedUser.fk_account_id,
        },
        data: {
          balance: debitedUser.account.balance - value
        }
      })
    }

    if (creditedUser && transaction) {
      await client.accounts.update({
        where: {
          id: creditedUser.fk_account_id,
        },
        data: {
          balance: creditedUser.account.balance + value
        }
      })
    }

    return { transaction }
  }
}

export { CreateTransactionUseCase };
