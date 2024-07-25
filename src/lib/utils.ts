import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { Payload } from 'src/users/user';

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

export async function accessibility(targetId: string, requester: Payload) {
  // decided to go with level of accessibility //
  /* 
    0 = no access
    1 = limited access
    2 = full access
  */

  if (targetId !== requester.id) {
    if (requester.role !== 'ADMIN') return 0;
  }

  if (requester.role !== 'ADMIN') {
    return 1;
  }

  return 2;
}
