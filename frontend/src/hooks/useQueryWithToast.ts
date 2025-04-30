import {useQuery, QueryHookOptions, OperationVariables} from "@apollo/client";
import {useToast} from "./useToast";

export const useQueryWithToast = <TData = any, TVariables extends OperationVariables = OperationVariables>(
	query: any,
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
