const DiscordJS = require('discord.js');
const { ApplicationCommandOptionType } = require('discord.js');
const Investment = require('../models/investment');

const USER = ApplicationCommandOptionType.User;


const description = 'Change the investor ID for a specific investment';

const options = [
    {
        name: 'investmentid',
        description: 'The ID of the investor to update',
        required: true,
        type: USER,
    },
    {
        name: 'newinvestorid',
        description: 'The new investor ID',
        required: true,
        type: USER,
    },
];

const adminIds = ["745857508689576007", "1072550831292948561", "1033578354361761892", "960580260829757461", "853875496570978335", "771721736307474433", "866792169288499251"];

const init = async (interaction, client) => {
    const Admin = interaction.user.id;
    const investmentId = interaction.options.get('investmentid').user.id.toString();
    const newInvestorId = interaction.options.get('newinvestorid').user.id.toString();

    try {
        if (adminIds.includes(interaction.user.id)) { 
            const investment = await Investment.findOneAndUpdate(
                { investorId: investmentId },
                { $set: { investorId: newInvestorId } },
                { new: true }
            );

            if (investment) {
                interaction.reply(`Investment ID ${investmentId} updated with new investor ID ${newInvestorId}`);
            } else {
                interaction.reply(`No investment found with ID ${investmentId}`);
            }
        } else {
            interaction.reply('You are not authorized to change investor IDs.');
        }
    } catch (error) {
        console.error('Error changing investor ID:', error);
        interaction.reply('There was an error changing the investor ID.');
    }
};

module.exports = { init, description, options };
