import {useMutation, MutationHookOptions, MutationTuple} from "@apollo/client";
import {useToast} from "../contexts/ToastContext";

export const useMutationWithToast = <TData = any, TVariables = any>(
	mutation: any,
	options?: MutationHookOptions<TData, TVariables>
): MutationTuple<TData, TVariables> => {
	const {addToast} = useToast();
	return useMutation(mutation, {
		...options,
		onError: error => {
			addToast(error.message, "error");
			if (options?.onError) {
				options.onError(error);
			}
		},
	});
};
