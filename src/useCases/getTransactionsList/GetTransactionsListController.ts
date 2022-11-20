import { Request, Response } from 'express';
import { GetTransactionsListUseCase } from './GetTransactionsListUseCase';

class GetTransactionsListController {
  async handle(request: Request, response: Response) {
    const authToken = request.headers.authorization;

    const filter = request.query.filter as string


    const getTransactionsListUseCase = new GetTransactionsListUseCase()

    if (authToken) {
      const transactionsList = await getTransactionsListUseCase.execute(authToken, filter)

      return response.json(transactionsList)
    }

    return response.json({
      message: 'Token inválido.'
    })
  }
}

export { GetTransactionsListController };
