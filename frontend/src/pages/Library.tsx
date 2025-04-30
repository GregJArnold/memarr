import {useState} from "react";
import {useQuery} from "@apollo/client";
import {useNavigate} from "react-router-dom";
import {
	Box,
	Container,
	Grid,
	Typography,
	TextField,
	Card,
	CardMedia,
	CardContent,
	CardActions,
	Button,
} from "@mui/material";
import {MemeUpload} from "../components/MemeUpload";
import {Meme, GET_MEMES_QUERY, inflateMeme} from "../graphql/meme";

export const Library = () => {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const {data, loading} = useQuery(GET_MEMES_QUERY);

	const filteredMemes = (data?.memes || []).map(inflateMeme);

	return (
		<Container maxWidth="lg">
			<Box sx={{mt: 4}}>
				<Grid spacing={4} sx={{sm: 4}}>
					<Typography variant="h3" component="h1" gutterBottom>
						My Meme Library
					</Typography>
					<MemeUpload />
				</Grid>
				<TextField
					fullWidth
					label="Search memes"
					variant="outlined"
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					sx={{mb: 4}}
				/>
			</Box>

			<Grid container spacing={4}>
				<Grid size={{xs: 12, md: 8}}>
					{loading ? (
						<Typography>Loading...</Typography>
					) : (
						<Grid container spacing={4}>
							{filteredMemes.map((meme: Meme) => (
								<Grid size={{xs: 12, sm: 6, md: 4}} key={meme.id}>
									<Card>
										<CardMedia component="img" height="200" image={meme.url} alt="Meme" />
										<CardContent>
											<Typography variant="body2" color="text.secondary">
												{new Date(meme.createdAt).toLocaleDateString()}
											</Typography>
										</CardContent>
										<CardActions sx={{justifyContent: "space-around"}}>
											<Button size="small" color="primary" onClick={() => navigate(`/library/${meme.id}`)}>
												View
											</Button>
											<Button size="small" color="primary">
												Edit
											</Button>
										</CardActions>
									</Card>
								</Grid>
							))}
						</Grid>
					)}
				</Grid>
			</Grid>
		</Container>
	);
};
