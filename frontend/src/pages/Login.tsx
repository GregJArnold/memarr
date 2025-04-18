import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {gql} from "@apollo/client";
import {useMutationWithToast} from "../hooks/useMutationWithToast";
import {useToast} from "../contexts/ToastContext";

const LOGIN_MUTATION = gql`
	mutation Login($email: EmailAddress!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				id
				email
			}
		}
	}
`;

export const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();
	const {addToast} = useToast();

	const [login] = useMutationWithToast(LOGIN_MUTATION, {
		onCompleted: data => {
			localStorage.setItem("token", data.login.token);
			addToast("Successfully logged in!", "success");
			navigate("/library");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		login({variables: {email, password}});
	};

	return (
		<div className="container mx-auto px-4">
			<div className="max-w-md mx-auto mt-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-6">Login</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							required
						/>
					</div>
					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Login
					</button>
				</form>
				<p className="mt-4 text-center text-sm text-gray-600">
					Don't have an account?{" "}
					<a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
						Sign up
					</a>
				</p>
			</div>
		</div>
	);
};
