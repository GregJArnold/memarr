import {AIClassifier} from "../services/ai-classification";
import {Task} from "../models/task";
import {IsolationLevel, transaction} from "../middleware/transaction";
import {Joined} from "../utils/relation-types";

const service = new AIClassifier();

async function processNextTask() {
	try {
		const task = await transaction(IsolationLevel.Serializable, async trx => {
			const task = (await Task.query()
				.where("action", "process")
				.orderBy("created_at", "asc")
				.withGraphFetched("meme")
				.first()) as Joined<Task, "meme">;
			if (!task) return;
			await task.$query(trx).patch({status: "processing"});
			return task;
		});

		if (!task) return;
		await task.meme.process(service);
		await Task.query().deleteById(task.id);
	} catch (error) {
		console.error("Error processing task:", error);
	}
}

// Process tasks every 5 seconds
setInterval(processNextTask, 5000);

// Also process immediately on startup
processNextTask().catch(console.error);
