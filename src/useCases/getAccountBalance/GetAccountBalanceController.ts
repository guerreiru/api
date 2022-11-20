import { Request, Response } from 'express';
import { GetAccountBalanceUserCase } from './GetAccountBalanceUserCase';

class GetAccountBalanceController {
  async handle(request: Request, response: Response) {
    const authToken = request.headers.authorization;

    const getAccountBalanceUserCase = new GetAccountBalanceUserCase()

    if (authToken) {
      const balance = await getAccountBalanceUserCase.execute(authToken)

      return response.json(balance)
    }

    return response.json({
      message: 'Token inválido.'
    })
  }
}

export { GetAccountBalanceController };
