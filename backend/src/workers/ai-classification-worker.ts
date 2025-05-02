import {AIClassifier} from "../services/ai-classification";
import {Task} from "../models/task";
import {IsolationLevel, transaction} from "../middleware/transaction";
import {Joined} from "../utils/relation-types";
import "../config/database";

const service = new AIClassifier();

async function processNextTask() {
	const task = await transaction(IsolationLevel.Serializable, async trx => {
		const task = (await Task.query()
			.where("action", "process")
			.orderBy("created_at", "asc")
			.withGraphJoined("meme")
			.limit(1)
			.first()) as Joined<Task, "meme">;
		if (!task) return;
		await task.$query(trx).patch({status: "processing"});
		return task;
	});
	if (!task) return;

	try {
		await task.meme.process(service);
		await Task.query().deleteById(task.id);
	} catch (error) {
		await task.$query().patch({status: "failed"});
		console.error("Error processing task:", error);
	}
}

// Process tasks every 5 seconds
setInterval(processNextTask, 5000);

// Also process immediately on startup
processNextTask().catch(console.error);
