import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import api from './api/index.js';

const app = new Hono();
app.use(prettyJSON());
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));

app.route('/api', api);

serve({
  fetch: app.fetch,
  port: 3000,
});

export default app;
