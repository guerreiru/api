import { client } from '../../prisma/client';
import { getUserIdFromToken } from '../../utils/getTokenData';

interface Transaction {
  id: string,
  value: number,
  created_at: Date,
  fk_debited_account_id: string,
  fk_credited_account_id: string,
  type: string
}

const transactionsSort = (transactions: Transaction[]) => {

  return transactions.sort((date1, date2) => {
    const date1_createdAt = new Date(date1.created_at).getTime()
    const date2_createdAt = new Date(date2.created_at).getTime()

    return date1_createdAt < date2_createdAt ? 1 : -1;
  });
}

const filterTransactions = (transactions: Transaction[], filter: string) => {
  const dateToFilter = filter.substring(0, 10)
  const filterByDate = new Date(dateToFilter).getTime()
  const filterByType = filter === 'credit' || filter === 'debit'


  if (filterByDate) {
    return transactionsSort(transactions.filter(transaction => {
      const transactionDate = new Date(transaction.created_at).toISOString().substring(0, 10)
      return transactionDate === dateToFilter
    }))
  } else if (filterByType) {
    return transactions.filter(transaction => transaction.type === filter)
  }
  return transactionsSort(transactions)
}

class GetTransactionsListUseCase {
  async execute(authToken: string, filter: string) {
    const userId = getUserIdFromToken(authToken)

    const userData = await client.users.findFirst({
      where: {
        id: userId,
      },
      include: {
        account: true,
      }
    })

    const debitTransactions = await client.transactions.findMany({
      where: {
        fk_debited_account_id: userData?.account.id
      }
    })

    const creditTransactions = await client.transactions.findMany({
      where: {
        fk_credited_account_id: userData?.account.id
      },
    })

    const debitTransactionsFormatted = debitTransactions.map(transaction => {
      return {
        ...transaction,
        type: 'debit',
      }
    })

    const creditTransactionsFormatted = creditTransactions.map(transaction => {
      return {
        ...transaction,
        type: 'credit',
      }
    })


    const transactionsList = [...debitTransactionsFormatted, ...creditTransactionsFormatted]

    return filterTransactions(transactionsList, filter)
  }
}

export { GetTransactionsListUseCase };
