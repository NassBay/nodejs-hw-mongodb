import createHttpError from 'http-errors';
import {
  registerUserService,
  loginUser,
  logoutUser,
  refreshUserSession,
} from '../services/auth.js';

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const newUser = await registerUserService({ name, email, password });
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const session = await loginUser({ email, password });

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(createHttpError(500, 'Failed to log in'));
  }
};

export const logout = async (req, res, next) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (typeof sessionId === 'string') {
      await logoutUser(sessionId);
    }

    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    res.status(204).end();
  } catch (error) {
    console.error('Logout error:', error);
    next(createHttpError(500, 'Failed to log out'));
  }
};


export const refresh = async (req, res, next) => {
  try {
    console.log('Cookies:', req.cookies); 

    if (!req.cookies.sessionId || !req.cookies.refreshToken) {
      throw createHttpError(400, 'Session ID or Refresh Token missing');
    }

    const session = await refreshUserSession(
      req.cookies.sessionId,
      req.cookies.refreshToken,
    );

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: session.refreshTokenValidUntil,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
