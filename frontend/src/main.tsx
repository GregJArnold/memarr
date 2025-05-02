import "./utils/errorReporting";
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import * as Sentry from "@sentry/react";

const container = document.getElementById("root");

const root = createRoot(container!, {
	onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
		console.warn("Uncaught error", error, errorInfo.componentStack);
	}),
	onCaughtError: Sentry.reactErrorHandler(),
	onRecoverableError: Sentry.reactErrorHandler(),
});
root.render(
	<StrictMode>
		<App />
	</StrictMode>
);
