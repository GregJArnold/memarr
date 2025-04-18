import * as Sentry from "@sentry/react";

export const initErrorReporting = (dsn: string) => {
	Sentry.init({
		dsn,
		integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
		tracesSampleRate: 1.0,
		replaysSessionSampleRate: 0.1,
		replaysOnErrorSampleRate: 1.0,
	});
};

export const captureError = (error: Error) => {
	Sentry.captureException(error);
};

export const captureMessage = (message: string) => {
	Sentry.captureMessage(message);
};
