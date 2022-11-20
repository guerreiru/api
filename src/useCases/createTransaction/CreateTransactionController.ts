import { Request, Response } from 'express';
import { CreateTransactionUseCase } from './CreateTransactionUseCase';

class CreateTransactionController {
  async handle(request: Request, response: Response) {
    const { creditedUsername, value } = request.body;
    const authToken = request.headers.authorization;

    const createTransactionUseCase = new CreateTransactionUseCase();

    if (creditedUsername.length) {
      const transaction = await createTransactionUseCase.execute({
        authToken, creditedUsername, value
      });

      return response.status(201).json(transaction);
    }
  }
}

export { CreateTransactionController };
