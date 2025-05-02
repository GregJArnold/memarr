import {
	useMutation,
	MutationHookOptions,
	MutationTuple,
	TypedDocumentNode,
	OperationVariables,
	DocumentNode,
} from "@apollo/client";
import {useToast} from "../contexts/ToastContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useMutationWithToast = <TData = any, TVariables extends OperationVariables = OperationVariables>(
	mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
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
