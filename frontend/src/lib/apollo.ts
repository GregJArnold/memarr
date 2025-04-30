import {ApolloClient, InMemoryCache, from} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const link = createUploadLink({
	uri: "http://localhost:4000/graphql",
	credentials: "include",
	headers: {"Apollo-Require-Preflight": "true"},
});

const authLink = setContext((_, {headers}) => {
	// Get the authentication token from local storage if it exists
	const token = localStorage.getItem("token");
	// Return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	};
});

export const client = new ApolloClient({
	link: from([authLink, link]),
	cache: new InMemoryCache(),
});
