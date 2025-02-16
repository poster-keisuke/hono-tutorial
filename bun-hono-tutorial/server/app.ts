import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { logger } from 'hono/logger';
import { authRoutes } from './routes/auth';
import { expensesRoutes } from './routes/expenses';

const app = new Hono();

app.use(logger());

const apiRoutes = app
  .basePath('api')
  .route('/expenses', expensesRoutes)
  .route('/', authRoutes);

app.use('*', serveStatic({ root: './frontend/dist' }));
app.get('*', serveStatic({ path: './frontend/dist/index.html' }));

export default app;
export type ApiRoutes = typeof apiRoutes;
