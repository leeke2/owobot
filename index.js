import fs from 'node:fs';

import pkg from 'discord.js';
const { Client, Collection, IntentsBitField } = pkg;

import { readFile } from 'fs/promises';

const config = JSON.parse(
	await readFile(
		new URL('./config.json', import.meta.url)
	)
);

const myIntents = new IntentsBitField();
myIntents.add(
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.GuildMembers,
	IntentsBitField.Flags.GuildIntegrations,
	IntentsBitField.Flags.GuildVoiceStates,
	// IntentsBitField.Flags.Guild
);

const client = new Client({ intents: myIntents });

const getJSFiles = (directory) => {
	return fs.readdirSync(directory).filter(file => file.endsWith('.js'));
};

client.commands = new Collection();

for (const file of getJSFiles('./commands')) {
	import(`./commands/${file}`)
		.then(function(command){
			client.commands.set(command.data.name, command);
		});
}

// Load events
const eventFiles = getJSFiles('./events');

for (const file of eventFiles) {
	import(`./events/${file}`)
		.then(function(event){
			if (event.once) {
				client.once(event.name, (...args) => event.execute(client, ...args));
			} else {
				client.on(event.name, (...args) => event.execute(client, ...args));
			}
		});
}

// Load crons
const cronFiles = getJSFiles('./cronjobs');

for (const file of cronFiles) {
	import(`./cronjobs/${file}`)
		.then(function(cron) {
			setInterval(() => {
				cron.execute(client);
			}, cron.interval * 1000);
		});
}

client.login(config.token);