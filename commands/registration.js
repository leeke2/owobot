import { SlashCommandBuilder } from '@discordjs/builders';

import pkg from 'discord.js';
const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, SelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = pkg;

export const data = new SlashCommandBuilder()
	.setName('registration')
	.setDescription('Create registration form');

export const execute = async (interaction) => {
	const embed = new EmbedBuilder()
		.setTitle(`Registration for OWL data study / accountability group`)
		.setDescription('Hello there, welcome to our first study group on OWL on data analytics and data science! The aim of the study group is to bring together like-minded folks who are at various stages in their in data science journey to learn and support each other along their journey.\n\nAs part of the group, we will pair members of similar skill level as accountability buddies to keep each other accountable to their study goals. Members would also be expected to participate in conversations and contribute consistently towards the group. If you are interested, click on the button below to register your interest, and we shall be in touch shortly! See you around soon! :D')
		.addFields(
			{ name: "Registration closes", value: "Aug 15, 2022 0000hrs", inline: true},
		).setTimestamp();

	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('register')
				.setLabel('Register')
				.setStyle(ButtonStyle.Primary),
		);

	await interaction.reply({ embeds: [embed], components: [row]});
}