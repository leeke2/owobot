import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';

// import pkg from 'discord.js';
// const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = pkg;

export const data = new SlashCommandBuilder()
	.setName('autodelete')
	.setDescription('Setup auto delete on a rolling basis')
	.addSubcommand(sc => sc
		.setName('set')
		.setDescription('Set auto-delete rule')
		.addChannelOption(option => option.setName('channel').setDescription('Select a channel'))
		.addIntegerOption(option => option.setName('interval').setDescription('How many days shall each post last')))
	.addSubcommand(sc => sc
		.setName('delete')
		.setDescription('Delete existing auto-delete rule')
		.addChannelOption(option => option.setName('channel').setDescription('Select a channel')))
	.addSubcommand(sc => sc
		.setName('info')
		.setDescription('Show current auto-delete setup'));

export const execute = async (interaction) => {
	const subcommand = interaction.options.getSubcommand();

	const {
		'autoDelete.intervals': autoDeleteIntervals,
		'autoDelete.exemptMessages': exemptMessages
	} = interaction.client.db.data;

	if (subcommand == 'set') {
		const interval = interaction.options.getInteger('interval');
		const channel = interaction.options.getChannel('channel');	

		autoDeleteIntervals[channel.id] = interval;

		interaction.client.db.data['autoDelete.intervals'] = autoDeleteIntervals;

		await interaction.reply({
			content: `Messages in <#${channel.id}> set to auto-delete after ${interval} days.`
		});
		interaction.client.db.write();
	} else if (subcommand == 'delete') {
		const channel = interaction.options.getChannel('channel');	

		interaction.client.db.data['autoDelete.intervals'] = Object.fromEntries(
			Object.entries(autoDeleteIntervals).filter(([key]) => key != channel.id)
		);
		interaction.client.db.write();

		await interaction.reply({
			'content': `Successfully deleted auto-delete rule for <#${channel.id}>`
		});
	} else if (subcommand == 'info') {
		const content = Object.keys(autoDeleteIntervals).map(channelId => {
			return `<#${channelId}>: ${autoDeleteIntervals[channelId]} days`
		});

		const embed = new EmbedBuilder()
			.setTitle("Auto-delete setup")
			.addFields(
				{ name: "Auto-delete enabled channels", value: (content.length == 0) ? "None" : content.join('\n') },
			);

		// await interaction.reply('asdasd')
		await interaction.reply({ embeds: [embed] });
	};
}