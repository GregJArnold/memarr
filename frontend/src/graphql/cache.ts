import {InMemoryCache, Reference} from "@apollo/client";

export const cache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				memes: {
					merge(existing: Reference[] = [], incoming: Reference[]) {
						return [...existing, ...incoming];
					},
				},
			},
		},
	},
});
