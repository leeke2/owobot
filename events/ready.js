import { Low, JSONFile } from 'lowdb'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFile } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const name = 'ready';
export const once = true;

export const execute = async (client) => {
	console.log(`Ready! Logged in as ${client.user.tag}`);

	const adapter = new JSONFile(join(__dirname, '..', 'states.json'));
	client.db = new Low(adapter);
	await client.db.read();

	client.db.data ||= {
		'autoDelete.intervals': {},
		'autoDelete.exemptMessages': [],
		'studyGroup.registrants': []
	};
};