import { NextFunction, Request, Response } from 'express';
import { client } from '../prisma/client';
import { regex } from '../utils/validation';

export const validateUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  const userExists = await client.users.findFirst({
    where: {
      username
    }
  })

  if (userExists) {
    return res.status(401).json({
      status: 401,
      message: 'Usuário já cadastrado',
    });
  } else if (username.trim().length < 3) {
    return res.status(401).json({
      status: 401,
      message: 'Usuario deve conter no minimo 3 caracteres',
    });
  } else if (!regex.password.test(password)) {
    return res.status(401).json({
      status: 401,
      message:
        'A senha deve ser composta por pelo menos 8 caracteres, um número e uma letra maiúscula',
    });
  }

  return next();
};
