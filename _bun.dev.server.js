import nextServer from 'next/dist/server/next-server';
import nextConfig from 'next/dist/server/config';

const nextApp = nextServer({
  conf: nextConfig.default,
  dev: process.env.NODE_ENV !== 'production',
});

export default nextApp;