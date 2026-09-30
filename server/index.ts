import app from './app.js';
import { connectDatabase } from './config/database.js';
import { loadEnv } from './config/env.js';

const env = loadEnv();
const port = Number(env.PORT || 5000);

async function bootstrap() {
  await connectDatabase(env.MONGODB_URI);
  app.listen(port, () => {
    console.log(`BookMyAppointment AI API listening on port ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
