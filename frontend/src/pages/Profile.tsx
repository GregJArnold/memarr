import {useQuery} from "@apollo/client";
import {Box, Container, Typography, Paper, Grid, Avatar, Button} from "@mui/material";
import {ME_QUERY} from "../graphql/user";

export const Profile = () => {
	const {data, loading} = useQuery(ME_QUERY);

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
				<Grid container spacing={4} sx={{xs: 12, md: 4}}>
					<Grid sx={{xs: 12, md: 4}}>
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
				</Grid>
			)}
		</Container>
	);
};
