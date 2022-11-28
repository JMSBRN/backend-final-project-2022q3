import { Response, Request } from 'express';
import * as userService from '../services/user.service';
import { checkBody, createError } from '../services/error.service';
import { hashPassword } from '../services/hash.service';


export const getUsers = async (req: Request, res: Response) => {
  const ids = req.query.ids as string[];
  const foundedUsers = await userService.findUsers();
  if (ids) {
    return res.json(foundedUsers.filter(item => ids.includes(item._id)));
  }
  try {
    res.json(foundedUsers);
  } catch (err) {
    console.log(err);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const foundedUser = await userService.findUserById(req.params['id']);
    res.json(foundedUser);
  }
  catch (err) {
    return res.status(404).send(createError(404, 'User was not founded!'));
  }

};

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params['id'];

  const bodyError = checkBody(req.body, ['name', 'login', 'password'])
  if (bodyError) {
    return res.status(400).send(createError(400, "bad request: " + bodyError));
  }
  const { login, name, password } = req.body;

  const foundedUser = await userService.findOneUser({ login });
  if (foundedUser && foundedUser.id !== id) {
    return res.status(409).send(createError(409, 'Login already exist'));
  }

  try {
    const hashedPassword = await hashPassword(password);
    const updatedUser = await userService.updateUser(id, { login, name: name, password: hashedPassword });
    res.json(updatedUser);
  }
  catch (err) { return console.log(err); }
}

export const deleteUser = async (req: Request, res: Response) => {
  const guid = req.header('Guid') || 'undefined';
  const initUser = req.header('initUser') || 'undefined';
  try {
    const deletedUser = await userService.deleteUserById(req.params.id, guid, initUser);
    res.json(deletedUser);
  }
  catch (err) { return console.log(err); }
}