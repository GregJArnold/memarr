import {useCallback, useState} from "react";
import {useQuery} from "@apollo/client";
import {useNavigate} from "react-router-dom";
import {useDebouncedCallback} from "use-debounce";
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
	FormControlLabel,
	Checkbox,
	Autocomplete,
	Chip,
} from "@mui/material";
import {MemeUpload} from "../components/MemeUpload";
import {Meme, GET_MEMES_QUERY, inflateMeme} from "../graphql/meme";
import {Template, GET_TEMPLATES_QUERY, inflateTemplate} from "../graphql/template";
import {Tag, GET_TAGS_QUERY, inflateTag} from "../graphql/tag";

interface SearchState {
	textContent: string;
	templateIds: string[];
	tagIds: string[];
	allTags: boolean;
}

export const Library = () => {
	const navigate = useNavigate();
	const [searchState, setSearchState] = useState<SearchState>({
		textContent: "",
		templateIds: [],
		tagIds: [],
		allTags: false,
	});

	const {
		data: memesData,
		loading: memesLoading,
		refetch,
	} = useQuery(GET_MEMES_QUERY, {
		variables: {
			textContent: "",
			templateId: undefined,
			tags: undefined,
			allTags: false,
		},
	});
	const debouncedSearch = useDebouncedCallback(refetch, 500);

	const {data: templatesData, loading: templatesLoading} = useQuery(GET_TEMPLATES_QUERY);
	const {data: tagsData, loading: tagsLoading} = useQuery(GET_TAGS_QUERY);

	const memes = (memesData?.memes ?? []).map(inflateMeme);
	const availableTemplates: Template[] = (templatesData?.templates ?? []).map(inflateTemplate);
	const availableTags: Tag[] = (tagsData?.tags ?? []).map(inflateTag);

	const loading = memesLoading || templatesLoading || tagsLoading;

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newState = {...searchState, textContent: e.target.value};
			setSearchState(newState);
			debouncedSearch(newState);
		},
		[debouncedSearch, searchState, setSearchState]
	);

	const handleTemplateChange = useCallback(
		(_: any, newValue: Template[]) => {
			const newState = {...searchState, templateIds: newValue.map(t => t.id)};
			setSearchState(newState);
			debouncedSearch(newState);
		},
		[debouncedSearch, searchState, setSearchState]
	);

	const handleTagChange = useCallback(
		(_: any, newValue: Tag[]) => {
			const newState = {...searchState, tagIds: newValue.map(t => t.id)};
			setSearchState(newState);
			debouncedSearch(newState);
		},
		[debouncedSearch, searchState, setSearchState]
	);

	const handleMatchAllChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newState = {...searchState, allTags: e.target.checked};
			setSearchState(newState);
			debouncedSearch(newState);
		},
		[debouncedSearch, searchState, setSearchState]
	);

	return (
		<Container maxWidth="lg">
			<Box sx={{mt: 4}}>
				<Grid spacing={4} sx={{sm: 4}}>
					<Typography variant="h3" component="h1" gutterBottom>
						My Meme Library
					</Typography>
					<MemeUpload />
				</Grid>

				<Box sx={{mb: 4}}>
					<TextField
						fullWidth
						label="Search text content"
						variant="outlined"
						value={searchState.textContent}
						onChange={handleSearchChange}
						sx={{mb: 2}}
					/>

					<Autocomplete
						multiple
						options={availableTemplates}
						getOptionLabel={(template: Template) => template.name}
						value={availableTemplates.filter(t => searchState.templateIds.includes(t.id))}
						onChange={handleTemplateChange}
						renderInput={params => <TextField {...params} label="Filter by template" />}
						renderTags={(value, getTagProps) =>
							value.map((option, index) => (
								<Chip label={option.name} {...getTagProps({index})} key={option.id} />
							))
						}
						sx={{mb: 2}}
					/>

					<Autocomplete
						multiple
						options={availableTags}
						getOptionLabel={(tag: Tag) => tag.name}
						value={availableTags.filter(t => searchState.tagIds.includes(t.id))}
						onChange={handleTagChange}
						renderInput={params => <TextField {...params} label="Filter by tags" />}
						renderTags={(value, getTagProps) =>
							value.map((option, index) => (
								<Chip label={option.name} {...getTagProps({index})} key={option.id} />
							))
						}
						sx={{mb: 2}}
					/>

					<FormControlLabel
						control={
							<Checkbox checked={searchState.allTags} onChange={handleMatchAllChange} name="allTags" />
						}
						label="Match all selected tags"
					/>
				</Box>
			</Box>

			<Grid container spacing={4}>
				<Grid size={{xs: 12, md: 8}}>
					{loading ? (
						<Typography>Loading...</Typography>
					) : memes.length === 0 ? (
						<Typography variant="h6" color="text.secondary" sx={{textAlign: "center", width: "100%"}}>
							No memes found. Try adjusting your search criteria.
						</Typography>
					) : (
						<Grid container spacing={4}>
							{memes.map((meme: Meme) => (
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
