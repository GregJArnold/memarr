import {gql, useQuery} from "@apollo/client";
import {
	Box,
	Container,
	Typography,
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	Avatar,
	Paper,
	Divider,
} from "@mui/material";

const GET_ACTIVITY_QUERY = gql`
	query GetActivity {
		activity {
			id
			type
			description
			createdAt
			user {
				id
				email
			}
		}
	}
`;

export const Activity = () => {
	const {data, loading} = useQuery(GET_ACTIVITY_QUERY);

	return (
		<Container maxWidth="lg">
			<Box sx={{mt: 4}}>
				<Typography variant="h3" component="h1" gutterBottom>
					Activity Feed
				</Typography>
			</Box>

			{loading ? (
				<Typography>Loading...</Typography>
			) : (
				<Paper elevation={3} sx={{mt: 4}}>
					<List>
						{data?.activity?.map((activity: any, index: number) => (
							<Box key={activity.id}>
								<ListItem alignItems="flex-start">
									<ListItemAvatar>
										<Avatar>{activity.user.email[0].toUpperCase()}</Avatar>
									</ListItemAvatar>
									<ListItemText
										primary={activity.description}
										secondary={
											<>
												<Typography component="span" variant="body2" color="text.primary">
													{activity.user.email}
												</Typography>
												{` — ${new Date(activity.createdAt).toLocaleString()}`}
											</>
										}
									/>
								</ListItem>
								{index < data.activity.length - 1 && <Divider variant="inset" component="li" />}
							</Box>
						))}
					</List>
				</Paper>
			)}
		</Container>
	);
};
