import {gql, useQuery} from "@apollo/client";
import {
	Box,
	Container,
	Typography,
	Paper,
	Grid,
	Avatar,
	Button,
	Card,
	CardMedia,
	CardContent,
	CardActions,
} from "@mui/material";

const GET_USER_PROFILE_QUERY = gql`
	query GetUserProfile {
		me {
			id
			email
			memes {
				id
				url
				title
				createdAt
			}
		}
	}
`;

export const Profile = () => {
	const {data, loading} = useQuery(GET_USER_PROFILE_QUERY);

	return (
		<Container maxWidth="lg">
			<Box sx={{mt: 4}}>
				<Typography variant="h3" component="h1" gutterBottom>
					My Profile
				</Typography>
			</Box>

			{loading ? (
				<Typography>Loading...</Typography>
			) : (
				<Grid container spacing={4}>
					<Grid item xs={12} md={4}>
						<Paper elevation={3} sx={{p: 4}}>
							<Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
								<Avatar sx={{width: 100, height: 100, mb: 2}}>{data?.me?.email[0].toUpperCase()}</Avatar>
								<Typography variant="h5" gutterBottom>
									{data?.me?.email}
								</Typography>
								<Button variant="contained" sx={{mt: 2}}>
									Edit Profile
								</Button>
							</Box>
						</Paper>
					</Grid>

					<Grid item xs={12} md={8}>
						<Typography variant="h5" gutterBottom>
							My Memes
						</Typography>
						<Grid container spacing={2}>
							{data?.me?.memes?.map((meme: any) => (
								<Grid item xs={12} sm={6} key={meme.id}>
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
					</Grid>
				</Grid>
			)}
		</Container>
	);
};
