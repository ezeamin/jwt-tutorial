import express from 'express';

import { authRouter } from './routers/authRoutes.js';

const mainRouter = express.Router();

mainRouter.use('/auth', authRouter);

export default mainRouter;
