export const interval = 1800;

export const execute = async (client) => {
	const {
		'autoDelete.intervals': autoDeleteIntervals,
		'autoDelete.exemptMessages': exemptMessages
	} = client.db.data;

	const currentTimestamp = Date.now();

	Object.keys(autoDeleteIntervals).forEach( async (channelId) => {
		const channel = await client.channels.fetch(channelId);
		const messages = await channel.messages.fetch();

		messages
			.filter(msg => !exemptMessages.includes(msg.id))
			.forEach( async (msg) => {
				const timeDifference = (currentTimestamp - msg.createdTimestamp) / 1000;

				if (timeDifference >= autoDeleteIntervals[channelId] * 3600 * 24) {
					const created = new Date(msg.createdTimestamp + 8 * 3600 * 1000);
					console.log(`[AutoDelete] Deleting message posted at ${created.toLocaleString()} by ${msg.author.username}#${msg.author.discriminator} in #${channel.name}.`)
					await msg.delete();
				}
			});
	});
}