import app from './app';
import config from './config';
import prisma from './shared/prisma';

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('Connected to the database successfully');

    app.listen(config.port, () => {
      console.log(`Application is running on port ${config.port}`);
    });
  } catch (error) {
    console.log('Failed to connect to the database', error);
  }
}

bootstrap();
