import * as Sentry from '@sentry/node';

export const initErrorReporting = (dsn: string) => {
  Sentry.init({
    dsn,
    tracesSampleRate: 1.0,
  });
};

export const captureError = (error: Error) => {
  Sentry.captureException(error);
};

export const captureMessage = (message: string) => {
  Sentry.captureMessage(message);
}; 