import {useState} from "react";

export const useToast = () => {
	const [toast, setToast] = useState<{message: string; type: "success" | "error"} | null>(null);

	const show = (message: string, type: "success" | "error" = "success") => {
		setToast({message, type});
		setTimeout(() => setToast(null), 3000);
	};

	const success = (message: string) => show(message, "success");
	const error = (message: string) => show(message, "error");

	return {toast, success, error};
};
