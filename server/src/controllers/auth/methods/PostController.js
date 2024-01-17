import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status-codes';

const { JWT_SECRET_KEY } = process.env;

const USER_DATABASE = {
  john: {
    id: 1,
    password: 'password',
  },
};

export class PostController {
  static async login(req, res) {
    const {
      body: { username, password },
    } = req;

    if (!username || !password) {
      res.status(HttpStatus.BAD_REQUEST).json({
        data: null,
        message: 'Username and Password are required',
      });
      return;
    }

    try {
      // 1- (Try to) Search user in DB
      const userInDB = USER_DATABASE[username.toLowerCase()];

      // 2- Validate credentials
      // Cases:
      // a. incorrect username (no user found)
      // b. incorrect password
      if (!userInDB || userInDB.password.trim() !== password.trim()) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          data: null,
          message: 'Username or password incorrect',
        });
        return;
      }

      // 3- Generate JWT
      // Everything is correct, generate JWT
      // We remove the password and isActive from the user object,
      // so that it doesn´t get sent to the FE
      const userInfo = {
        user: {
          id: userInDB.id,
          name: username,
        },
      };

      // (payload, secretKey, options)
      const accessToken = jwt.sign(userInfo, JWT_SECRET_KEY, {
        expiresIn: '1h',
      });
      const refreshToken = jwt.sign(userInfo, JWT_SECRET_KEY, {
        expiresIn: '2h',
      });

      // 4- Send JWT to FE
      res.cookie('refresh_token', refreshToken, {
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      res.json({
        data: { token: accessToken },
        message: 'Login OK',
      });
    } catch (err) {
      console.error('🟥', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: {
          data: null,
          message: `ERROR: ${err}`,
        },
      });
    }
  }

  static logout(_, res) {
    try {
      // delete refreshToken cookie
      res.clearCookie('refresh_token', {
        sameSite: 'none',
        secure: true,
      });
      res.json({
        data: null,
        message: 'Logout OK',
      });
    } catch (err) {
      console.error('🟥', err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        errors: {
          data: null,
          message: `ERROR: ${err}`,
        },
      });
    }
  }
}
