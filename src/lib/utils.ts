import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';

export async function hashPassword(rawPassword: string) {
  const SALT = 10;
  return bcrypt.hashSync(rawPassword, SALT);
}

export async function isPasswordCorrect(
  passwordInput: string,
  userPassword: string,
) {
  const isMatch = bcrypt.compareSync(passwordInput, userPassword);
  return isMatch;
}

export async function validateObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}
