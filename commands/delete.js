const DiscordJS = require('discord.js');
const Investment = require('../models/investment');
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const mongoose = require('mongoose');

const NUMBER = ApplicationCommandOptionType.Number;

const description = 'Delete an investment based on its ID';

const options = [
    {
        name: 'investmentid',
        description: 'The ID of the investment to delete',
        required: true,
        type: NUMBER,
    },
];

const adminIds = ["1072550831292948561", "1033578354361761892", "960580260829757461", "853875496570978335", "771721736307474433", "866792169288499251"];

const init = async (interaction, client) => {
    const investmentId = interaction.options.getNumber('investmentid');

    try {
        if (adminIds.includes(interaction.user.id)) {
            const foundInvestment = await Investment.findOneAndUpdate(
                { 'investments.investId': investmentId },
                { $pull: { 'investments': { investId: investmentId } } },
                { new: true }
            );

            if (foundInvestment) {
                console.log('Investment deleted:', foundInvestment);
                interaction.reply(`Investment with ID ${investmentId} has been deleted.`);
            } else {
                interaction.reply(`No investment found with ID ${investmentId}.`);
            }
        } else {
            interaction.reply('You are not authorized to delete investments.');
        }
    } catch (error) {
        console.error('Error deleting investment:', error);
        interaction.reply('There was an error deleting the investment.');
    }
};

module.exports = { init, description, options };
