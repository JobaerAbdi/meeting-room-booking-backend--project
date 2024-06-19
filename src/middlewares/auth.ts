/*
import httpStatus from 'http-status';
import config from '../config';
import AppError from '../errors/AppError';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
*/

import jwt, { JwtPayload } from 'jsonwebtoken'
import catchAsync from '../utils/catchAsync'
import { NextFunction, Request, Response } from 'express'
import config from '../config'
import { TUserRole } from '../modules/User/user.interface'
import { User } from '../modules/User/user.model'

const auth = (...requiredRoles: TUserRole[]) => {
//   console.log('requiredRoles form auth middleware =>', requiredRoles)
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization
    // console.log(
    //   'admin token inject into get all faculties route, req.headers.authorization =>',
    //   token,
    // )

    // checking if the token is missing
    if (!token) {
      throw new Error('You are not authorized!')
    }

    //............................................................................................
    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload

    // console.log('decoded =>', decoded)
    // [decoded = {userId: 'A-0001', role: 'admin', iat: 1718209499, exp: 1719073499}]
    // (decoded.userId = 'A-0001')
    // (decoded.role = 'admin')

    //-------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------
    const { email, role, iat, exp } = decoded
    const isUserExists = await User.findOne({
      email: email,
    })
    //console.log(isUserExists);
    /*
{
  _id: new ObjectId('666bd5e7079052438a8de329'),
  id: 'A-0001',
  password: '$2b$12$PgFgHBeKQ5x6VKjtL7Dq1edZ4nuoMwAYOdDbrCOVvEXXVOX7Hjw.q',
  needsPasswordChange: true,
  role: 'admin',
  status: 'in-progress',
  isDeleted: false,
  createdAt: 2024-06-14T05:32:23.721Z,
  updatedAt: 2024-06-14T05:32:23.721Z,
  __v: 0
}
  */

    if (!isUserExists) {
      throw new Error('This user is not found!')
    }

    //...........................................................................................

    // // (isUserExists?.isDeleted = false)
    // const isDeleted = isUserExists?.isDeleted
    // // console.log(isDeleted); //=> false
    // if (isDeleted) {
    //   throw new Error('This user is deleted!')
    // }

    //...........................................................................................

    // // (isUserExists?.status = in-progress)
    // const userStatus = isUserExists?.status
    // // console.log(userStatus); //=> in-progress
    // if (userStatus === 'blocked') {
    //   throw new Error('This user is blocked!')
    // }

    //-------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------------

    // if (
    //   isUserExists.passwordChangedAt &&
    //   User.isJWTIssuedBeforePasswordChanged(
    //     isUserExists.passwordChangedAt,
    //     iat as number,
    //   )
    // ) {
    //   throw new Error('You are not authorized !');
    // }



    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new Error('You are not authorized hay!')
    }
    req.user = decoded as JwtPayload
    next()
    // checking if the given token is valid

    //............................................................................................
  })
}

/*
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, userId, iat } = decoded;

    // checking if the user is exist
    const user = await User.isUserExistsByCustomId(userId);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted

    const isDeleted = user?.isDeleted;

    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }

    // checking if the user is blocked
    const userStatus = user?.status;

    if (userStatus === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized  hi!',
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};
*/

export default auth
