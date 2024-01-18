import express from 'express';

import { Auth } from '../../controllers/auth/index.js';

export const authRouter = express.Router();

// POST ---------------------------
authRouter.post('/login', Auth.PostController.login);
authRouter.post('/logout', Auth.PostController.logout);
authRouter.post('/refresh-token', Auth.PostController.refreshToken);
