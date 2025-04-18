import path from "path";
import fs from "fs/promises";
import {v4 as uuidv4} from "uuid";

export class FileUploadService {
	private readonly uploadDir: string;

	constructor() {
		this.uploadDir = path.join(process.cwd(), "storage", "memes");
	}

	async saveMeme(file: Buffer, originalName: string): Promise<string> {
		// Generate a unique filename
		const extension = path.extname(originalName);
		const filename = `${uuidv4()}${extension}`;
		const filepath = path.join(this.uploadDir, filename);

		// Ensure directory exists
		await fs.mkdir(this.uploadDir, {recursive: true});

		// Save file
		await fs.writeFile(filepath, file);

		return filename;
	}

	async deleteMeme(filename: string): Promise<void> {
		const filepath = path.join(this.uploadDir, filename);
		try {
			await fs.unlink(filepath);
		} catch (error) {
			// Ignore error if file doesn't exist
			if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
				throw error;
			}
		}
	}

	getMemePath(filename: string): string {
		return path.join(this.uploadDir, filename);
	}
}
