import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useMutationWithToast} from "../hooks/useMutationWithToast";
import {gql} from "@apollo/client";
import {Box, Button, Container, TextField, Typography, Paper, Link} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";

const SIGNUP_MUTATION = gql`
	mutation SignUp($email: EmailAddress!, $password: String!) {
		signUp(email: $email, password: $password) {
			token
			user {
				id
				email
			}
		}
	}
`;

export const Signup = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [signUp] = useMutationWithToast(SIGNUP_MUTATION);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			// TODO: Add proper error handling
			return;
		}

		const {data} = await signUp({variables: {email, password}});
		if (data?.signUp?.token) {
			localStorage.setItem("token", data.signUp.token);
			navigate("/");
		}
	};

	return (
		<Container maxWidth="sm">
			<Paper elevation={3} sx={{p: 4, mt: 8}}>
				<Typography variant="h4" component="h1" gutterBottom align="center">
					Sign Up
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
					<TextField
						fullWidth
						label="Confirm Password"
						type="password"
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}
						margin="normal"
						required
						error={password !== confirmPassword && confirmPassword !== ""}
						helperText={
							password !== confirmPassword && confirmPassword !== "" ? "Passwords do not match" : ""
						}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{mt: 3, mb: 2}}
						disabled={password !== confirmPassword}
					>
						Sign Up
					</Button>
					<Typography variant="body2" align="center">
						Already have an account?{" "}
						<Link component={RouterLink} to="/login">
							Login
						</Link>
					</Typography>
				</Box>
			</Paper>
		</Container>
	);
};
