import fs from 'node:fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { readFile } from 'fs/promises';
// const { clientId, guildId, token } './config.json');

const config = JSON.parse(
  await readFile(
    new URL('./config.json', import.meta.url)
  )
);

let commands = [];

var commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	await import(`./commands/${file}`)
		.then((command) => {
			let data;
			try {
				data = command.data.toJSON();
			} catch(err) {
				data = command.data;
			}

			commands.push(data);
		});

}

console.log(commands);

const rest = new REST({ version: '9' }).setToken(config.token);

rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);