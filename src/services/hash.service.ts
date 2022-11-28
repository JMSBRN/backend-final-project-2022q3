import bcrypt from 'bcrypt';

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 12);
}

export const checkPassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
}