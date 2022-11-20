import { NextFunction, Request, Response, Router } from 'express';
import { ensureAuthenticated } from './middlewares/ensureAuthenticated';
import { validateUserData } from './middlewares/validateUserData';
import { AuthenticateUserController } from './useCases/authenticateUser/AuthenticateUserController';
import { CreateTransactionController } from './useCases/createTransaction/CreateTransactionController';
import { CreateUserController } from './useCases/createUser/CreateUserController';
import { GetAccountBalanceController } from './useCases/getAccountBalance/GetAccountBalanceController';
import { GetTransactionsListController } from './useCases/getTransactionsList/GetTransactionsListController';
import { RefreshTokenUserController } from './useCases/refreshTokenUser/RefreshTokenUserController';

const router = Router();

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();
const refreshTokenUserController = new RefreshTokenUserController();
const getAccountBalanceController = new GetAccountBalanceController();
const createTransactionController = new CreateTransactionController();
const getTransactionsListController = new GetTransactionsListController();

router.post('/users', validateUserData, createUserController.handle);
router.post('/login', authenticateUserController.handle);
router.post('/refresh-token', ensureAuthenticated, refreshTokenUserController.handle);
router.get('/account/balance', ensureAuthenticated, getAccountBalanceController.handle);
router.post('/account/transaction', ensureAuthenticated, createTransactionController.handle);
router.get('/account/transactions-list', ensureAuthenticated, getTransactionsListController.handle);
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    menssage: 'Api rodando'
  })
});

export { router };
