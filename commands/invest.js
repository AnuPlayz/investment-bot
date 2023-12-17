const DiscordJS = require('discord.js')
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const mongoose = require('mongoose');
const Investment = require('../models/investment');

const NUMBER = ApplicationCommandOptionType.Number;
const USER = ApplicationCommandOptionType.User;

const description = 'Returns the amount user will get after a specific time period'

const options = [
    {
        name: 'amount',
        description: 'The amount person is investing',
        required: true,
        type: NUMBER,
    },
    {
        name: 'percent',
        description: 'The interest rate person is getting for the amount invested',
        required: true,
        type: NUMBER,
    },
    {
        name: 'days',
        description: 'The time till investment matures',
        required: true,
        type: NUMBER,
    },
    {
        name: 'investor',
        description: 'The ID of the person investing',
        required: true,
        type: USER,
    },
]

const adminIds = ["1072550831292948561", "1033578354361761892", "960580260829757461", "853875496570978335", "771721736307474433", "866792169288499251"];

let counter = 10000;

const init = async (interaction, client) => {

    const currentDate = new Date();
    const days = interaction.options.getNumber('days') * 86400000;
    const newDate = new Date(currentDate.getTime() + days);

    const investor = interaction.options.get('investor').user.id.toString();

    const returns = interaction.options.getNumber('amount') + (interaction.options.getNumber('percent') / 100 * interaction.options.getNumber('amount'));

    try {
        let investorInvestments = await Investment.findOne({ investorId: investor });

        if (adminIds.includes(interaction.user.id)) {
            if (!investorInvestments) {
                investorInvestments = await Investment.create({
                    investorId: investor,
                    username: interaction.user.username,
                    investments: [],
                });
            }

            const newInvestment = {
                investId: counter,
                investedAmount: interaction.options.getNumber('amount'),
                returnsAmount: returns,
                startDate: currentDate,
                endDate: newDate,
            };

            investorInvestments.investments.push(newInvestment);
            counter++;

            await investorInvestments.save();
            console.log('New investment added for investor:', investorInvestments);



            const latestInvestment = investorInvestments.investments[investorInvestments.investments.length - 1];
            const date = (latestInvestment.endDate).toString().slice(4, 15);

            const Embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Investment Bot')
                .setURL('https://discord.com/channels/1070782093975621743/1070783898180665345')
                .setAuthor({ name: 'Investment Crew', iconURL: 'https://media.discordapp.net/attachments/1106614543611875381/1185508865257787462/image.png', url: 'https://discord.com/channels/1070782093975621743/1070783903461285980' })
                .setDescription('A discord bot which allows the managing of investments throughout the server while managing the privacy of the users')
                .setThumbnail('https://images-ext-2.discordapp.net/external/72vH0zU02BJrDvKfPVGD38xuYts2xktxTiHt5bSxTF8/%3Fsize%3D1024/https/cdn.discordapp.com/icons/1070782093975621743/a_0a6cf10a21bd6f11732c236717c13d10.gif')
                .addFields(
                    { name: 'Investor Name', value: `<@${investorInvestments.investorId}>` },
                    { name: 'Invested Amount', value: `<:mee6Coins:1185628496366674030> ${latestInvestment.investedAmount}`, inline: true },
                    { name: 'Returns', value: `<:mee6Coins:1185628496366674030> ${latestInvestment.returnsAmount}`, inline: true },

                )
                .addFields(
                    { name: 'Returns Date', value: date, inline: true },
                    { name: 'ID', value: `<:greentick:1185628472614322186> ${latestInvestment.investId}` }
                )
                .setTimestamp()
                .setFooter({ text: 'Made by venti2 with love', iconURL: 'https://images-ext-2.discordapp.net/external/3b8tHG7r18zdDpVVLWHED5vnQDoOjPNgdQH90Ri2Ylc/%3Fsize%3D1024/https/cdn.discordapp.com/avatars/1072550831292948561/428c7f28465881d53c9a518d34268f9b.png' });

            let reply = await interaction.reply({ embeds: [Embed], fetchReply: true });
            reply.react('<a:PepegaCredit:1185448910706196510>');
        }
        else {
            let reply = await interaction.reply(`Gambling is better anw investment returns would be approx ${returns} and date when it may mature is ${newDate}`)
        }
    } catch (error) {
        console.error('Error creating investment:', error);
    }
}
module.exports = { init, description, options }
