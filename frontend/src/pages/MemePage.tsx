import {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {useMutationWithToast} from "../hooks/useMutationWithToast";
import {useQueryWithToast} from "../hooks/useQueryWithToast";
import {
	GET_MEME_QUERY,
	ADD_TAG_MUTATION,
	REMOVE_TAG_MUTATION,
	ADD_TEXT_BLOCK_MUTATION,
	UPDATE_TEXT_BLOCK_MUTATION,
	DELETE_TEXT_BLOCK_MUTATION,
} from "../graphql/meme";
import {
	Box,
	Paper,
	Typography,
	Chip,
	TextField,
	Button,
	IconButton,
	CircularProgress,
	Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export const MemePage = () => {
	const {memeId} = useParams<{memeId: string}>();
	const [newTag, setNewTag] = useState("");
	const [editingTextBlock, setEditingTextBlock] = useState<string | null>(null);
	const [newTextBlock, setNewTextBlock] = useState("");

	const {data, loading, startPolling, stopPolling} = useQueryWithToast(GET_MEME_QUERY, {
		variables: {memeId},
		skip: !memeId,
	});

	const [addTag] = useMutationWithToast(ADD_TAG_MUTATION);
	const [removeTag] = useMutationWithToast(REMOVE_TAG_MUTATION);
	const [addTextBlock] = useMutationWithToast(ADD_TEXT_BLOCK_MUTATION);
	const [updateTextBlock] = useMutationWithToast(UPDATE_TEXT_BLOCK_MUTATION);
	const [deleteTextBlock] = useMutationWithToast(DELETE_TEXT_BLOCK_MUTATION);

	useEffect(() => {
		if (memeId && data?.meme?.state === "PROCESSING") {
			startPolling(1000);
		} else {
			stopPolling();
		}
		return () => stopPolling();
	}, [memeId, data?.meme?.state, startPolling, stopPolling]);

	const handleAddTag = async () => {
		if (!newTag.trim() || !memeId) return;
		await addTag({
			variables: {memeId, tagName: newTag.trim()},
		});
		setNewTag("");
	};

	const handleRemoveTag = async (tagId: string) => {
		if (!memeId) return;
		await removeTag({
			variables: {memeId, tagId},
		});
	};

	const handleAddTextBlock = async () => {
		if (!newTextBlock.trim() || !memeId) return;
		const position = (data?.meme?.textBlocks?.length || 0) + 1;
		await addTextBlock({
			variables: {memeId, text: newTextBlock.trim(), position},
		});
		setNewTextBlock("");
	};

	const handleUpdateTextBlock = async (textBlockId: string, text: string) => {
		await updateTextBlock({
			variables: {textBlockId, text},
		});
		setEditingTextBlock(null);
	};

	const handleDeleteTextBlock = async (textBlockId: string) => {
		await deleteTextBlock({
			variables: {textBlockId},
		});
	};

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
				<CircularProgress />
			</Box>
		);
	}

	if (!data?.meme) {
		return (
			<Box p={4}>
				<Typography variant="h5">Meme not found</Typography>
			</Box>
		);
	}

	const {meme} = data;

	return (
		<Box p={4}>
			<Paper elevation={3} sx={{p: 4, mb: 4}}>
				<Box display="flex" justifyContent="center" mb={4}>
					<img
						src={meme.filePath}
						alt="Meme"
						style={{maxWidth: "100%", maxHeight: "500px", objectFit: "contain"}}
					/>
				</Box>

				{meme.state === "PROCESSING" && (
					<Box display="flex" alignItems="center" gap={2} mb={4}>
						<CircularProgress size={20} />
						<Typography>Processing meme...</Typography>
					</Box>
				)}

				{meme.category && (
					<Box mb={4}>
						<Typography variant="h6" gutterBottom>
							Category
						</Typography>
						<Chip label={meme.category.name} color="primary" />
					</Box>
				)}

				<Box mb={4}>
					<Typography variant="h6" gutterBottom>
						Tags
					</Typography>
					<Box display="flex" gap={1} flexWrap="wrap" mb={2}>
						{meme.tags?.map((tag: {id: string; name: string}) => (
							<Chip key={tag.id} label={tag.name} onDelete={() => handleRemoveTag(tag.id)} />
						))}
					</Box>
					<Box display="flex" gap={1}>
						<TextField
							size="small"
							value={newTag}
							onChange={e => setNewTag(e.target.value)}
							placeholder="Add new tag"
						/>
						<Button variant="contained" onClick={handleAddTag} disabled={!newTag.trim()}>
							Add
						</Button>
					</Box>
				</Box>

				<Box>
					<Typography variant="h6" gutterBottom>
						Text Blocks
					</Typography>
					<Stack spacing={2} mb={2}>
						{meme.textBlocks?.map((textBlock: {id: string; text: string; position: number}) => (
							<Box key={textBlock.id} display="flex" alignItems="center" gap={1}>
								{editingTextBlock === textBlock.id ? (
									<>
										<TextField
											fullWidth
											size="small"
											defaultValue={textBlock.text}
											onKeyDown={e => {
												if (e.key === "Enter") {
													handleUpdateTextBlock(textBlock.id, (e.target as HTMLInputElement).value);
												}
											}}
										/>
										<IconButton
											onClick={() =>
												handleUpdateTextBlock(
													textBlock.id,
													(document.querySelector(`input[value="${textBlock.text}"]`) as HTMLInputElement)
														.value
												)
											}
										>
											<AddIcon />
										</IconButton>
									</>
								) : (
									<>
										<Typography flex={1}>{textBlock.text}</Typography>
										<IconButton onClick={() => setEditingTextBlock(textBlock.id)}>
											<EditIcon />
										</IconButton>
										<IconButton onClick={() => handleDeleteTextBlock(textBlock.id)}>
											<DeleteIcon />
										</IconButton>
									</>
								)}
							</Box>
						))}
					</Stack>
					<Box display="flex" gap={1}>
						<TextField
							fullWidth
							size="small"
							value={newTextBlock}
							onChange={e => setNewTextBlock(e.target.value)}
							placeholder="Add new text block"
						/>
						<Button variant="contained" onClick={handleAddTextBlock} disabled={!newTextBlock.trim()}>
							Add
						</Button>
					</Box>
				</Box>
			</Paper>
		</Box>
	);
};
