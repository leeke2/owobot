import { SlashCommandBuilder } from '@discordjs/builders';

import pkg from 'discord.js';
const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = pkg;

export const data = new SlashCommandBuilder()
	.setName('events')
	.setDescription('Create new event');

export const execute = async (interaction) => {

	const modal = new ModalBuilder()
		.setCustomId('myModal')
		.setTitle('New ouwlting');

	const nameInput = new TextInputBuilder()
		.setCustomId('eventName')
		.setLabel('Ouwlting name')
		.setStyle(TextInputStyle.Short);

	const startTimeInput = new TextInputBuilder()
		.setCustomId('startTime')
		.setLabel('Start time')
		.setPlaceholder('Try "Monday 7PM"')
		.setStyle(TextInputStyle.Short);

	const endTimeInput = new TextInputBuilder()
		.setCustomId('endTime')
		.setLabel('End time')
		.setStyle(TextInputStyle.Short)
		.setPlaceholder('Try "Monday 9PM"')
		.setRequired(false);

	const inputs = [nameInput, startTimeInput, endTimeInput];

	modal.addComponents(...inputs.map( input =>
		new ActionRowBuilder().addComponents(input)
	));
	await interaction.showModal(modal);
}