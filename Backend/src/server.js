import http from 'http';
import app from './app.js';
import { connectDB } from './utils/db.js';
import { loadEnv } from './utils/env.js';

loadEnv();
const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB();
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`CampusLink backend listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
