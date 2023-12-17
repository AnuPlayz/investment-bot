const DiscordJS = require('discord.js');
const { ApplicationCommandOptionType, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const Investment = require('../models/investment');

const USER = ApplicationCommandOptionType.User;

const description = `Returns details of one's investment`;

const previous = new ButtonBuilder()
    .setCustomId('previous')
    .setLabel('Previous')
    .setStyle(ButtonStyle.Secondary);

const next = new ButtonBuilder()
    .setCustomId('next')
    .setLabel('Next')
    .setStyle(ButtonStyle.Secondary);

const row = new ActionRowBuilder()
    .addComponents(previous, next);

const options = [
    {
        name: 'investor',
        description: 'The ID of the person investing',
        required: true,
        type: USER,
    },
];

const adminIds = ["1072550831292948561", "1033578354361761892", "960580260829757461", "853875496570978335", "771721736307474433", "866792169288499251"];

const init = async (interaction, client) => {
    try {
        const investor = interaction.options.get('investor').user.id.toString();
        const user = interaction.user.id.toString();
        const foundInvestor = await Investment.findOne({ investorId: investor });

        if (foundInvestor) {
            if (foundInvestor.investorId === user || adminIds.includes(interaction.user.id)) {
                const investments = foundInvestor.investments;
                let index = investments.length - 1;
                let date = (investments[index].endDate).toString().slice(4, 15);
                const Embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Investment Bot')
                    .setURL('https://discord.com/channels/1070782093975621743/1070783898180665345')
                    .setAuthor({ name: 'Investment Crew', iconURL: 'https://media.discordapp.net/attachments/1106614543611875381/1185508865257787462/image.png', url: 'https://discord.com/channels/1070782093975621743/1070783903461285980' })
                    .setDescription('A discord bot which allows the managing of investments throughout the server while managing the privacy of the users')
                    .setThumbnail('https://images-ext-2.discordapp.net/external/72vH0zU02BJrDvKfPVGD38xuYts2xktxTiHt5bSxTF8/%3Fsize%3D1024/https/cdn.discordapp.com/icons/1070782093975621743/a_0a6cf10a21bd6f11732c236717c13d10.gif')
                    .addFields(
                        { name: 'Investor Name', value: `<@${foundInvestor.investorId}>` },
                        { name: 'Invested Amount', value: `<:mee6Coins:1185628496366674030> ${investments[index].investedAmount}`, inline: true },
                        { name: 'Returns', value: `<:mee6Coins:1185628496366674030> ${investments[index].returnsAmount}`, inline: true },
                    )
                    .addFields(
                        { name: 'Returns Date', value: date, inline: true },
                        { name: 'ID', value: `<:greentick:1185628472614322186> ${investments[index].investId}` }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Made by venti2 with love', iconURL: 'https://images-ext-2.discordapp.net/external/3b8tHG7r18zdDpVVLWHED5vnQDoOjPNgdQH90Ri2Ylc/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/1072550831292948561/428c7f28465881d53c9a518d34268f9b.png' });

                const reply = await interaction.reply({ embeds: [Embed], fetchReply: true, components: [row] });
                reply.react('<a:PepegaCredit:1185448910706196510>');

                const collectorFilter = i => i.user.id === interaction.user.id;
                try {
                    const confirmation = reply.createMessageComponentCollector({ filter: collectorFilter, time: 60000 });

                    confirmation.on('collect', async (_interaction) => {
                        if (_interaction.customId === 'previous') {
                            index = Math.min(Math.max(index + 1, 0), investments.length - 1);
                        } else if (_interaction.customId === 'next') {
                            index = Math.max(Math.min(index - 1, investments.length - 1), 0);
                        }

                        date = (investments[index].endDate).toString().slice(4, 15);
                        let newEmbed = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle('Investment Bot')
                            .setURL('https://discord.com/channels/1070782093975621743/1070783898180665345')
                            .setAuthor({ name: 'Investment Crew', iconURL: 'https://media.discordapp.net/attachments/1106614543611875381/1185508865257787462/image.png', url: 'https://discord.com/channels/1070782093975621743/1070783903461285980' })
                            .setDescription('A discord bot which allows the managing of investments throughout the server while managing the privacy of the users')
                            .setThumbnail('https://images-ext-2.discordapp.net/external/72vH0zU02BJrDvKfPVGD38xuYts2xktxTiHt5bSxTF8/%3Fsize%3D1024/https/cdn.discordapp.com/icons/1070782093975621743/a_0a6cf10a21bd6f11732c236717c13d10.gif')
                            .addFields(
                                { name: 'Investor Name', value: `<@${foundInvestor.investorId}>` },
                                { name: 'Invested Amount', value: `<:mee6Coins:1185628496366674030> ${investments[index].investedAmount}`, inline: true },
                                { name: 'Returns', value: `<:mee6Coins:1185628496366674030> ${investments[index].returnsAmount}`, inline: true },
                            )
                            .addFields(
                                { name: 'Returns Date', value: date, inline: true },
                                { name: 'ID', value: `<:greentick:1185628472614322186> ${investments[index].investId}` }
                            )
                            .setTimestamp()
                            .setFooter({ text: 'Made by venti2 with love', iconURL: 'https://images-ext-2.discordapp.net/external/3b8tHG7r18zdDpVVLWHED5vnQDoOjPNgdQH90Ri2Ylc/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/1072550831292948561/428c7f28465881d53c9a518d34268f9b.png' });

                        await _interaction.update({ embeds: [newEmbed], components: [row] });
                    })

                }
                catch (e) {
                    await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
                }
            }
            else {
                interaction.reply('You can only see your own investment details.');
            }
        }
        else {
            interaction.reply('No investments of this user.');
        }
    } catch (error) {
        console.error('Error fetching investment details:', error);
        interaction.reply('There was an error fetching investment details.');
    }
};

module.exports = { init, description, options };
