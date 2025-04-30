import {Router, Request, Response, NextFunction} from "express";
import {Meme} from "../models/meme";
import {FileUploadService} from "../services/fileUpload";
import {readFile} from "fs/promises";
import {extname} from "path";

const router = Router();
const fileUploadService = new FileUploadService();

const getMimeType = (filePath: string): string => {
	const ext = extname(filePath).toLowerCase();
	switch (ext) {
		case ".jpg":
		case ".jpeg":
			return "image/jpeg";
		case ".png":
			return "image/png";
		case ".gif":
		case ".gifv":
			return "image/gif";
		case ".webp":
			return "image/webp";
		case ".heic":
			return "image/heic";
		case ".heif":
			return "image/heif";
		case ".bmp":
			return "image/bmp";
		case ".tif":
		case ".tiff":
			return "image/tiff";
		default:
			return "application/octet-stream";
	}
};

router.get("/:memeId", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const meme = await Meme.query().findById(req.params.memeId);

		if (!meme) {
			return res.status(404).json({error: "Meme not found"});
		}

		try {
			const filePath = fileUploadService.getMemePath(meme.filePath);
			const imageBuffer = await readFile(filePath);
			const mimeType = getMimeType(meme.filePath);
			res.setHeader("Content-Type", mimeType);
			res.send(imageBuffer);
		} catch (error) {
			console.error("Error serving image:", error);
			res.status(500).json({error: "Failed to serve image"});
		}
	} catch (error) {
		next(error);
	}
});

export default router;
