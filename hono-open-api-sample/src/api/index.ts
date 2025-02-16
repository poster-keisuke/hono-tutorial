import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { route } from '../route.js';

const api = new OpenAPIHono();

api
  .openapi(route, (c) => {
    const { id } = c.req.valid('param');
    return c.json(
      {
        id,
        age: 20,
        name: 'Ultra-man',
      },
      200 // You should specify the status code even if it is 200.
    );
  })
  .doc('/specification', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'My API',
    },
  })
  .get(
    '/doc',
    swaggerUI({
      url: '/api/specification',
    })
  );

export default api;
