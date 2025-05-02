import {useQuery, DocumentNode, OperationVariables, QueryHookOptions} from "@apollo/client";
import {useToast} from "./useToast";

export const useQueryWithToast = <TData = any, TVariables extends OperationVariables = OperationVariables>(
	query: DocumentNode,
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
