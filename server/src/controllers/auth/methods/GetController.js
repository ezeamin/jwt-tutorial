import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status-codes';

const { JWT_SECRET_KEY } = process.env;

export class GetController {
  static async refreshToken(req, res) {
    const {
      cookies: { refresh_token: refreshToken },
    } = req;

    try {
      if (!refreshToken) throw new Error('No refresh token found');

      // 1- Validate JWT
      // (payload, secretKey, options)
      const { user } = jwt.verify(refreshToken, JWT_SECRET_KEY);

      const userInfo = { user };

      // 2- Generate new JWT
      // (payload, secretKey, options)
      const accessToken = jwt.sign(userInfo, JWT_SECRET_KEY, {
        expiresIn: '1h',
      });
      const newRefreshToken = jwt.sign(userInfo, JWT_SECRET_KEY, {
        expiresIn: '2h',
      });

      // 3- Send JWT to FE
      res.cookie('refresh_token', newRefreshToken, {
        expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      res.json({
        data: { token: accessToken },
        message: 'Refresh OK',
      });
    } catch (err) {
      console.error('🟥', err);
      // delete refreshToken cookie
      res.clearCookie('refresh_token');
      res.status(HttpStatus.UNAUTHORIZED).json({
        data: null,
        message: null,
      });
    }
  }
}
