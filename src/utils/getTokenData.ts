import { verify } from 'jsonwebtoken';

interface ITokenData {
  user: {
    id: string,
    username: string,
    balance: number
  }
  iat: number,
  exp: number,
  sub: string
}

export const getTokenData = (token: string | undefined) => {
  if (token) {
    const _token = token.replace('Bearer', '').trim();

    const _tokenData = verify(_token, '33779428-f03f-4f4f-929d-b1db7d8441d0');

    return JSON.stringify(_tokenData)

  }
  return JSON.stringify({})
}

export const getUserIdFromToken = (token: string | undefined) => {
  const _tokenData: ITokenData = JSON.parse(getTokenData(token))

  if (_tokenData) {
    return _tokenData.user.id
  }

  return {}
}