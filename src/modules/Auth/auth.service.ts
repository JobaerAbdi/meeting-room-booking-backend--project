import { string } from 'zod'
/*
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import { createToken } from './auth.utils';
*/
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { TLoginUser } from './auth.interface'
import config from '../../config'
import { createToken } from './auth.utils'
import { User } from '../User/user.model'

// ====================================================================================

const loginUser = async (payload: TLoginUser) => {
  // console.log("Admin payload =>", payload);   // { id: 'A-0001', password: 'admin123' }
  // (payload?.id = 'A-0001')
  // (payload?.password = 'admin123')

  // console.log("Faculty payload =>", payload); // { id: '', password: '' }
  // (payload?.id = '')
  // (payload?.password = '')

  // console.log("Student payload =>", payload); // { id: '2030010001', password: 'student123' }
  // (payload?.id = '2030010001')
  // (payload?.password = 'student123')

 

  //...........................................................................................

  // => Check this (admin/faculty/student) user exists in users collection database by payload?.id
  const isUserExists = await User.findOne({
    email: payload?.email,
  })
  // console.log("isUserExists from service=>", isUserExists);
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

  //...........................................................................................
  
  // Plane pass => (payload?.password = 'admin123')
  // Hash pass  => (isUserExists?.password = '$2b$12$PgFgHBeKQ5x6VKjtL7Dq1edZ4nuoMwAYOdDbrCOVvEXXVOX7Hjw.q')
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    isUserExists?.password,
  )
  if (!isPasswordMatched) {
    throw new Error('Password does not matched!')
  }

  //...........................................................................................
  
  // (isUserExists?.id = 'A-0001')
  // (isUserExists?.role = 'admin')
  const jwtPayload = {
    email: isUserExists?.email, 
    role: isUserExists?.role,
  }

 /*
  const accessToken = jwt.sign(
    jwtPayload, 
    config.jwt_access_secret as string,
    {expiresIn: '10d'}
  )
  

  const refreshToken = jwt.sign(
    jwtPayload, 
    config.jwt_refresh_secret as string,
    {expiresIn: '365d'}
  )
  */

  const accessToken = createToken(
    jwtPayload, 
    config.jwt_access_secret as string, 
    config.jwt_access_expire_in as string
  )


  // const refreshToken = createToken(
  //   jwtPayload, 
  //   config.jwt_refresh_secret as string, 
  //   config.jwt_refresh_expire_in as string
  // )

  //...........................................................................................

  // (isUserExists?.needsPasswordChange = true)
  return {
    accessToken,
    isUserExists
    // refreshToken,
  }
}

// ....................................................................................

/*
const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(payload.id);

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

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //create token and sent to the  client

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};
*/

// ====================================================================================
/*
const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userData.userId);

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

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};
*/

// ====================================================================================

// const changePassword = async (
//   user: JwtPayload,
//   // user=>
//   /*
// {
//   userId: '2030020001',
//   role: 'student',
//   iat: 1718290422,
//   exp: 1719154422
// }
//   */

//   payload: { oldPassword: string; newPassword: string },
//   // payload=>
//   // { oldPassword: 'student123', newPassword: 'student1234' }
// ) => {
//   const isUserExists = await User.findOne({
//     id: user?.userId,
//   })

//   console.log('From changePassword=>', isUserExists)

//   // console.log(isUserExists);
//   /*
// {
// _id: new ObjectId('666a866063d248ee80afbbb0'),
// id: '2030020001',
// password: '$2b$12$EUSM.GsvfhwBBfIe7AzZlOPqcSETFGnIagQ.Zg3U8BkRTtfbQ4/gG',
// needsPasswordChange: true,
// role: 'student',
// status: 'in-progress',
// isDeleted: false,
// createdAt: 2024-06-13T05:40:48.851Z,
// updatedAt: 2024-06-13T05:40:48.851Z,
// __v: 0
// }
// */

//   if (!isUserExists) {
//     throw new Error('This user is not found!')
//   }

//   const isDeleted = isUserExists?.isDeleted //=> false
//   // console.log(isDeleted); //=> false
//   if (isDeleted) {
//     throw new Error('This user is deleted!')
//   }

//   const userStatus = isUserExists?.status //=> in-progress
//   // console.log(userStatus); //=> in-progress
//   if (userStatus === 'blocked') {
//     throw new Error('This user is blocked!')
//   }

//   const isPasswordMatched = await bcrypt.compare(
//     payload?.oldPassword,
//     isUserExists?.password,
//   )

//   if (!isPasswordMatched) {
//     throw new Error('Password does not matched!')
//   }

//   // hash new password
//   const newHashedPassword = await bcrypt.hash(
//     payload?.newPassword,
//     Number(config.bcrypt_salt_rounds),
//   )

//   await User.findOneAndUpdate(
//     {
//       id: user?.userId,
//       role: user?.role,
//     },
//     {
//       password: newHashedPassword,
//       needsPasswordChange: false,
//       passwordChangedAt: new Date(),
//     },
//   )
//   return null
// }

// ====================================================================================

// const refreshToken = async (token: string) => {
//   // checking if the given token is valid
//   const decoded = jwt.verify(
//     token,
//     config.jwt_refresh_secret as string,
//   ) as JwtPayload;

//   const { userId, iat } = decoded;

//   // checking if the user is exist
//   const isUserExists = await User.findOne({
//     id: userId,
//   })

//   if (!isUserExists) {
//     throw new Error('This user is not found !');
//   }
//   // checking if the user is already deleted
//   const isDeleted = isUserExists?.isDeleted;

//   if (isDeleted) {
//     throw new Error('This user is deleted !');
//   }

//   // checking if the user is blocked
//   const userStatus = isUserExists?.status;

//   if (userStatus === 'blocked') {
//     throw new Error('This user is blocked ! !');
//   }

//   if (
//     isUserExists?.passwordChangedAt &&
//     User.isJWTIssuedBeforePasswordChanged(isUserExists.passwordChangedAt, iat as number)
//   ) {
//     throw new Error('You are not authorized !');
//   }

//   const jwtPayload = {
//     userId: isUserExists?.id,
//     role: isUserExists?.role,
//   };

//   const accessToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     config.jwt_access_expire_in as string,
//   );

//   return {
//     accessToken,
//   };
// };


// ====================================================================================

export const AuthServices = {
  loginUser,
  // changePassword,
  // refreshToken,
}
