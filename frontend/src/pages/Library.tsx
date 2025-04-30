import {useState} from "react";
import {gql, useQuery} from "@apollo/client";
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

const GET_MEMES_QUERY = gql`
	query GetMemes {
		memes {
			id
			url
			title
			createdAt
		}
	}
`;

export const Library = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const {data, loading} = useQuery(GET_MEMES_QUERY);

	const filteredMemes =
		data?.memes?.filter((meme: any) => meme.title.toLowerCase().includes(searchQuery.toLowerCase())) || [];

	return (
		<Container maxWidth="lg">
			<Box sx={{mt: 4}}>
				<Typography variant="h3" component="h1" gutterBottom>
					My Meme Library
				</Typography>
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
				<Grid size={{xs: 12, md: 4}}>
					<MemeUpload />
				</Grid>
				<Grid size={{xs: 12, md: 8}}>
					{loading ? (
						<Typography>Loading...</Typography>
					) : (
						<Grid container spacing={4}>
							{filteredMemes.map((meme: any) => (
								<Grid size={{xs: 12, sm: 6, md: 4}} key={meme.id}>
									<Card>
										<CardMedia component="img" height="200" image={meme.url} alt={meme.title} />
										<CardContent>
											<Typography gutterBottom variant="h6" component="div">
												{meme.title}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												{new Date(meme.createdAt).toLocaleDateString()}
											</Typography>
										</CardContent>
										<CardActions>
											<Button size="small" color="primary">
												Share
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
