import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { initDb } from './config/db';
import { runSeeder } from './seeds/seed';
import router from './routes/web';
import { loadUserSession } from './middleware/auth';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 5000;

  // 1. Establish Database Connection (Mongoose with JSON backup engines)
  await initDb();

  // 2. Clear & Seed mock playground matrices on cold boot
  await runSeeder();

  // 3. Body Request Parsers & Cookie Decoders
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(session({
    secret: process.env.SESSION_SECRET || 'shopzy_express_session_secret_12345',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'none'
    }
  }));

  // 4. EJS Views Engine Setup
  app.set('view engine', 'ejs');
  app.set('views', path.join(process.cwd(), 'views'));

  // 5. Session Loading middleware to provide res.locals context
  app.use(loadUserSession);

  // 6. Register Web View & API Routes
  app.use('/', router);

  // 7. Static and Vite asset compilations
  app.use(express.static(path.join(process.cwd(), 'public')));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom', // Specify 'custom' to let Express render customized EJS views
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
  }

  // 8. Bind listener to port 3000 on 0.0.0.0 (mandatory)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Shopzy e-commerce server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('❌ Server startup failure:', err);
});
