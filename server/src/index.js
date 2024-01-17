import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import mainRouter from './routes/mainRouter.js';

console.clear(); // Clear any previous console logs
console.log('⌛ Starting server...');

// 1- Initialize server
const app = express();

// 2- CORS configurations
const whitelist = ['http://localhost:5173', 'https://my-frontend.url.com'];
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(console.error(`🟥 Not allowed by CORS -> ${origin}`));
    }
  },
};

// 3- Middlewares
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json()); // <== Parse body as JSON (otherwise "undefined")
app.use(express.urlencoded({ extended: true })); // <== Parse body as URL encoded data
app.use(cookieParser()); // <== Parse cookies

// 4- Routes
app.use('/api/v1', mainRouter);

// 5- Server loop
const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`✅ Server up and running -> Port ${PORT}\n`);
});
