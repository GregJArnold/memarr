import {
	useQuery,
	DocumentNode,
	OperationVariables,
	QueryHookOptions,
	TypedDocumentNode,
} from "@apollo/client";
import {useToast} from "./useToast";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useQueryWithToast = <TData = any, TVariables extends OperationVariables = OperationVariables>(
	query: DocumentNode | TypedDocumentNode<TData, TVariables>,
	options?: QueryHookOptions<TData, TVariables>
) => {
	const toast = useToast();
	const result = useQuery<TData, TVariables>(query, {
		...options,
		onError: error => {
			toast.error(error.message);
			options?.onError?.(error);
		},
	});

	return result;
};
