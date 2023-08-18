import { createProxyMiddleware } from 'http-proxy-middleware';
import { Application } from 'express';

export default function setupProxy(app: Application) {
  app.use(
    '/',
    createProxyMiddleware({
      target: 'http://:5000/',
      changeOrigin: true,
    })
  );
}