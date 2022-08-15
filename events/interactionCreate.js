import pkg from 'discord.js'
const { InteractionType, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = pkg

import chrono from 'chrono-node'

export const name = 'interactionCreate';
export const execute = async (client, interaction) => {		
	let command;

	if (interaction.type === InteractionType.MessageComponent) {
		const modal = new ModalBuilder()
			.setCustomId('osgRegistration')
			.setTitle('Registration for OWL data study group');

		const motivationInput = new TextInputBuilder()
			.setCustomId('motivation')
			.setLabel('What is your motivation for joing the group?')
			.setPlaceholder('Tell us what makes you want to learn data, is it career shift, self-improvement or something else?')
			.setStyle(TextInputStyle.Paragraph)
			.setMaxLength(1000);

		const coursesInput = new TextInputBuilder()
			.setCustomId('courses')
			.setLabel('What are you currently / planning to learn?')
			.setPlaceholder('Please list the courses that you are following, and include the links if possible.')
			.setStyle(TextInputStyle.Paragraph)
			.setMaxLength(1000);

		const proficiencyInput = new TextInputBuilder()
			.setCustomId('proficiency')
			.setLabel('How proficient are you in each category?')
			.setPlaceholder('Describe your proficiency level in SQL, dashboarding, python/R programming and machine learning.')
			.setStyle(TextInputStyle.Paragraph)
			.setMaxLength(1000);

		const inputs = [motivationInput, coursesInput, proficiencyInput];

		modal.addComponents(...inputs.map( input =>
			new ActionRowBuilder().addComponents(input)
		));
		await interaction.showModal(modal);

	} else if (interaction.type === InteractionType.ApplicationCommand) {
		// console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction ${interaction.commandName}.`);
		command = interaction.client.commands.get(interaction.commandName);
		await command.execute(interaction);
	} else if (interaction.type === InteractionType.ModalSubmit) {
		if (interaction.customId === 'myModal') {
			const eventName = interaction.fields.getTextInputValue('eventName');
			try {
				const startTime = chrono.parseDate(
					interaction.fields.getTextInputValue('startTime'), {
						timezone: 480
					}
				); 

				const endTime = chrono.parseDate(
					interaction.fields.getTextInputValue('endTime'), {
						timezone: 480
					}
				); 

				await interaction.reply({
					content: `Your submission was received successfully!\nEvent name: ${eventName}\nStart time: ${startTime}\nEnd time: ${endTime}`
				});
			} catch (error) {
				console.log(error);
				await interaction.reply({ content: "An error has occurred." })
			}
		} else if (interaction.customId === 'osgRegistration') {
			// try {
				const motivation = interaction.fields.getTextInputValue('motivation');
				const courses = interaction.fields.getTextInputValue('courses');
				const proficiency = interaction.fields.getTextInputValue('proficiency');
				
				await interaction.reply({
					content: `Thank you for your interest, we have successfully received your submission! Shortlisted candidates will be notified in due course.`,
					ephemeral: true
				});

				const embed = new EmbedBuilder()
					.setDescription(`<@${interaction.member.user.id}>`)
					.setAuthor({
						name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
						iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.png`
					})
					.addFields(
						{ name: "Motivations", value: motivation },
						{ name: "Courses", value: courses },
						{ name: "Proficiency", value: proficiency },
					).setTimestamp();

				const channel = await interaction.client.channels.fetch('1007563628490272778');
				await channel.send({ embeds: [embed] });

				const { 'studyGroup.registrants': registrants } = interaction.client.db.data;
				registrants.push({
					'username': `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
					'motivation': motivation,
					'courses': courses,
					'proficiency': proficiency
				});
				interaction.client.db.data['studyGroup.registrants'] = registrants;
				interaction.client.db.write();

			// } catch (error) {
			// 	console.log(error);
			// 	await interaction.reply({ content: "An error has occurred. Please try again later.", ephemeral: true })
			// }
		}
	}

	return ;
};