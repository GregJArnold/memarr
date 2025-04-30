import {ChangeEvent} from "react";
import {useMutationWithToast} from "../hooks/useMutationWithToast";
import {gql} from "@apollo/client";
import {useNavigate} from "react-router-dom";
import {Button, Paper} from "@mui/material";
import {CloudUpload} from "@mui/icons-material";

const UPLOAD_MEME_MUTATION = gql`
	mutation UploadMeme($file: Upload!) {
		uploadMeme(file: $file) {
			id
			filePath
		}
	}
`;

export const MemeUpload = () => {
	const navigate = useNavigate();
	const [uploadMeme, {loading}] = useMutationWithToast(UPLOAD_MEME_MUTATION);

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target?.files?.[0]) return;

		uploadMeme({variables: {file: e.target.files[0]}}).then(({data}) => {
			if (data?.uploadMeme?.id) {
				navigate(`/library/${data.uploadMeme.id}`);
			}
		});
	};

	return (
		<Button component="label" variant="contained" startIcon={<CloudUpload />} disabled={loading}>
			Upload a Meme
			<input hidden accept="image/*" type="file" onChange={handleFileChange} />
		</Button>
	);
};
