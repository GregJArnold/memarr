import {createContext, useCallback, useContext, useState, ReactNode, useMemo} from "react";
import {Snackbar, Alert, AlertColor} from "@mui/material";

interface Toast {
	id: string;
	message: string;
	type: AlertColor;
}

interface ToastContextType {
	toasts: Toast[];
	addToast: (message: string, type: AlertColor) => void;
	removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({children}: {children: ReactNode}) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const removeToast = useCallback((id: string) => {
		setToasts(prev => prev.filter(toast => toast.id !== id));
	}, []);

	const addToast = useCallback((message: string, type: AlertColor) => {
		const id = Math.random().toString(36).substr(2, 9);
		setToasts(prev => [...prev, {id, message, type}]);
	}, []);

	const value = useMemo(() => ({removeToast, addToast, toasts}), [removeToast, addToast, toasts]);

	return (
		<ToastContext.Provider value={value}>
			{children}
			{toasts.map(toast => (
				<Snackbar
					key={toast.id}
					open={true}
					autoHideDuration={5000}
					onClose={() => value.removeToast(toast.id)}
					anchorOrigin={{vertical: "bottom", horizontal: "right"}}
					sx={{bottom: 24}}
				>
					<Alert onClose={() => removeToast(toast.id)} severity={toast.type} sx={{width: "100%"}}>
						{toast.message}
					</Alert>
				</Snackbar>
			))}
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const context = useContext(ToastContext);
	if (context === undefined) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
};
