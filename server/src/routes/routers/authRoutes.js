import express from 'express';

import { Auth } from '../../controllers/auth/index.js';

export const authRouter = express.Router();

// GET ---------------------------
authRouter.get('/refresh-token', Auth.GetController.refreshToken);

// POST ---------------------------
authRouter.post('/login', Auth.PostController.login);
authRouter.post('/logout', Auth.PostController.logout);
