import {createContext, useContext, useState, ReactNode} from "react";

interface Toast {
	id: string;
	message: string;
	type: "success" | "error" | "info";
}

interface ToastContextType {
	toasts: Toast[];
	addToast: (message: string, type: "success" | "error" | "info") => void;
	removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({children}: {children: ReactNode}) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = (message: string, type: "success" | "error" | "info") => {
		const id = Math.random().toString(36).substr(2, 9);
		setToasts(prev => [...prev, {id, message, type}]);
		setTimeout(() => removeToast(id), 5000);
	};

	const removeToast = (id: string) => {
		setToasts(prev => prev.filter(toast => toast.id !== id));
	};

	return (
		<ToastContext.Provider value={{toasts, addToast, removeToast}}>
			{children}
			<div className="fixed bottom-4 right-4 z-50 space-y-2">
				{toasts.map(toast => (
					<div
						key={toast.id}
						className={`${
							toast.type === "success"
								? "bg-green-100 border-green-400 text-green-700"
								: toast.type === "error"
								? "bg-red-100 border-red-400 text-red-700"
								: "bg-blue-100 border-blue-400 text-blue-700"
						} border px-4 py-3 rounded relative`}
					>
						<span className="block sm:inline">{toast.message}</span>
						<button
							className="absolute top-0 bottom-0 right-0 px-4 py-3"
							onClick={() => removeToast(toast.id)}
						>
							<span className="sr-only">Close</span>
							<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				))}
			</div>
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
