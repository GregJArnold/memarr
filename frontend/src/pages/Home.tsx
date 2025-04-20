import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useMutationWithToast} from "../hooks/useMutationWithToast";
import {gql} from "@apollo/client";
import {Box, Button, Container, Grid, Paper, Typography, TextField} from "@mui/material";

const UPLOAD_MEME_MUTATION = gql`
	mutation UploadMeme($file: Upload!) {
		uploadMeme(file: $file) {
			id
			url
		}
	}
`;

export const Home = () => {
	const navigate = useNavigate();
	const [file, setFile] = useState<File | null>(null);
	const [uploadMeme] = useMutationWithToast(UPLOAD_MEME_MUTATION);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) return;

		const {data} = await uploadMeme({variables: {file}});
		if (data?.uploadMeme?.id) {
			navigate(`/meme/${data.uploadMeme.id}`);
		}
	};

	return (
		<Container maxWidth="lg">
			<Box sx={{mt: 4}}>
				<Typography variant="h3" component="h1" gutterBottom align="center">
					Welcome to Memarr
				</Typography>
				<Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
					Create and share your memes
				</Typography>
			</Box>

			<Grid container spacing={4} sx={{mt: 4}}>
				<Grid size={{xs: 12, md: 6}}>
					<Paper elevation={3} sx={{p: 4}}>
						<Typography variant="h5" gutterBottom>
							Upload a Meme
						</Typography>
						<Box component="form" onSubmit={handleSubmit}>
							<TextField
								fullWidth
								type="file"
								onChange={handleFileChange}
								margin="normal"
								required
								inputProps={{accept: "image/*"}}
							/>
							<Button type="submit" variant="contained" fullWidth sx={{mt: 2}} disabled={!file}>
								Upload
							</Button>
						</Box>
					</Paper>
				</Grid>
				<Grid size={{xs: 12, md: 6}}>
					<Paper elevation={3} sx={{p: 4}}>
						<Typography variant="h5" gutterBottom>
							Quick Actions
						</Typography>
						<Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
							<Button variant="contained" onClick={() => navigate("/library")} fullWidth>
								View My Library
							</Button>
							<Button variant="contained" onClick={() => navigate("/activity")} fullWidth>
								View Activity
							</Button>
							<Button variant="contained" onClick={() => navigate("/profile")} fullWidth>
								My Profile
							</Button>
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Container>
	);
};
