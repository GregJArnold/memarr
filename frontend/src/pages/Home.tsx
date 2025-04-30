import {useNavigate} from "react-router-dom";
import {Box, Button, Container, Grid, Paper, Typography} from "@mui/material";
import {MemeUpload} from "../components/MemeUpload";

export const Home = () => {
	const navigate = useNavigate();

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
					<MemeUpload />
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
