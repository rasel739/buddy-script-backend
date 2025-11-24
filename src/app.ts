import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import httpStatus from 'http-status';
import routes from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import config from './config';
const app: Application = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (config.allowed_origins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// import all routes
app.use('/api/v1', routes);

// test route
app.use('/', (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/') {
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    });
  }
  next();
});

// global error handler
app.use(globalErrorHandler);

// handle not found routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found',
      },
    ],
  });
  next();
});

export default app;
