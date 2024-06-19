/*
import httpStatus from 'http-status';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
*/

import { RequestHandler } from "express";
import { AuthServices } from "./auth.service";
// import { date } from "zod";
// import config from "../../config";

// ====================================================================================

const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const logData = req.body;
    const result = await AuthServices.loginUser(logData);
    const { accessToken, isUserExists } = result;
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "User is logged in successfully!",
      token: accessToken,
      data: isUserExists,
    })
  } catch (err) {
    next(err)
  }
};
//......................................................................................
// const loginUser = catchAsync(async (req, res) => {
//   const result = await AuthServices.loginUser(req.body);
//   const { refreshToken, accessToken, needsPasswordChange } = result;

//   res.cookie('refreshToken', refreshToken, {
//     secure: config.NODE_ENV === 'production',
//     httpOnly: true,
//   });

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'User is logged in succesfully!',
//     data: {
//       accessToken,
//       needsPasswordChange,
//     },
//   });
// });

// ====================================================================================

// const changePassword: RequestHandler = async (req, res, next) => {
//   try {
//     // console.log(req.user);
//     /*
//     {
//       userId: '2030020001',
//       role: 'student',
//       iat: 1718290422,
//       exp: 1719154422
//     }
//     */
//     // console.log(req.body);
//     // { oldPassword: 'student123', newPassword: 'student1234' }

//     const { ...passwordData } = req.body;
//     const result = await AuthServices.changePassword(req.user, passwordData);
//     res.status(200).json({
//       success: true,
//       message: "Password is update successfully!",
//       data: result,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

//..........................................................................

/*
const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthServices.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated successfully!',
    data: result,
  });
});
*/

// ====================================================================================

/*
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});
*/

//.................................................................
// const refreshToken: RequestHandler = async (req, res, next) => {
//   try {
//     const { refreshToken } = req.cookies;
//     const result = await AuthServices.refreshToken(refreshToken);
//     res.status(200).json({
//       success: true,
//       message: "Access token is retrieved successfully!",
//       data: result,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// ====================================================================================

export const AuthControllers = {
  loginUser,
  // changePassword,
  // refreshToken,
};
