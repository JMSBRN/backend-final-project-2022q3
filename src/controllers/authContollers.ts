import { Response, Request } from 'express';
import * as userService from '../services/user.service';
import { checkBody, createError } from '../services/error.service';
import { checkPassword, hashPassword } from '../services/hash.service';
import { signToken } from '../services/token.service';

export const signIn = async (req: Request, res: Response) => {

  const bodyError = checkBody(req.body, ['login', 'password'])
  if (bodyError) {
    return res.status(400).send(createError(400, "bad request: " + bodyError));
  }

  const { login, password } = req.body;

  const foundedUser = await userService.findOneUser({ login });
  if (foundedUser) {
    const isCorrectPassword = await checkPassword(password, foundedUser.password);
    if (isCorrectPassword) {
      return res.send({ token: signToken(foundedUser._id, login) })
    }
  }

  return res.status(401).send(createError(401, 'Authorization error'));

};


export const signUp = async (req: Request, res: Response) => {

  const bodyError = checkBody(req.body, ['name', 'login', 'password'])
  if (bodyError) {
    return res.status(400).send(createError(400, "bad request: " + bodyError));
  }
  const { login, name, password } = req.body;

  const foundedUser = await userService.findOneUser({ login });
  if (foundedUser) {
    return res.status(409).send(createError(409, 'Login already exist'));
  }
  const hashedPassword = await hashPassword(password);

  try {
    const newUser = await userService.createUser({ login, name, password: hashedPassword });
    res.json(newUser);
  }
  catch (err) { return console.log(err); }
};

export const chek = async (req: Request, res: Response) => {
  return res.status(200).send(createError(200, 'success'));
};
