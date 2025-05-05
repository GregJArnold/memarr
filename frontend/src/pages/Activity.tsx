import {useQuery} from "@apollo/client";
import {useNavigate} from "react-router-dom";
import {
	Box,
	Container,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Tooltip,
} from "@mui/material";
import {GET_EVENTS_QUERY, Event} from "../graphql/event";

export const Activity = () => {
	const navigate = useNavigate();
	const {data, loading} = useQuery<{events: Event[]}>(GET_EVENTS_QUERY);

	if (loading) {
		return (
			<Container maxWidth="lg">
				<Typography>Loading...</Typography>
			</Container>
		);
	}

	const events = data?.events || [];

	return (
		<Container maxWidth="lg">
			<Box sx={{mt: 4}}>
				<Typography variant="h3" component="h1" gutterBottom>
					Activity
				</Typography>

				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Thumbnail</TableCell>
								<TableCell>Template</TableCell>
								<TableCell>Event</TableCell>
								<TableCell>Date</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{events.map(event => (
								<TableRow key={event.id}>
									<TableCell>
										<Tooltip title="Click to view full image">
											<Box
												component="img"
												src={event.meme.url}
												alt="Meme thumbnail"
												sx={{
													width: 100,
													height: 100,
													objectFit: "cover",
													cursor: "pointer",
												}}
												onClick={() => navigate(`/library/${event.meme.id}`)}
											/>
										</Tooltip>
									</TableCell>
									<TableCell>{event.meme.template?.name || "Unknown"}</TableCell>
									<TableCell>{event.description}</TableCell>
									<TableCell>{new Date(event.createdAt).toLocaleDateString()}</TableCell>
									<TableCell>
										<Button
											variant="contained"
											size="small"
											onClick={() => navigate(`/library/${event.meme.id}`)}
										>
											View
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Container>
	);
};
