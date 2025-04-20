import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useMutationWithToast} from "../hooks/useMutationWithToast";
import {gql} from "@apollo/client";
import {Box, Button, Container, TextField, Typography, Paper} from "@mui/material";

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
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [login] = useMutationWithToast(LOGIN_MUTATION);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const {data} = await login({
			variables: {
				email,
				password,
			},
		});
		if (data?.login?.token) {
			localStorage.setItem("token", data.login.token);
			navigate("/");
		}
	};

	return (
		<Container maxWidth="sm">
			<Paper elevation={3} sx={{p: 4, mt: 8}}>
				<Typography variant="h4" component="h1" gutterBottom align="center">
					Login
				</Typography>
				<Box component="form" onSubmit={handleSubmit} sx={{mt: 2}}>
					<TextField
						fullWidth
						label="Email"
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						margin="normal"
						required
					/>
					<TextField
						fullWidth
						label="Password"
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						margin="normal"
						required
					/>
					<Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
						Login
					</Button>
				</Box>
			</Paper>
		</Container>
	);
};
