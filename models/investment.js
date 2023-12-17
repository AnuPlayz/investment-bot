const mongoose = require('mongoose');
const { Schema } = mongoose;

const investmentSchema = new Schema({
    username: { type: String, required: true },
    investorId: { type: String, required: true },
    investments: [{
        investId: { type: Number },
        investedAmount: { type: Number },
        returnsAmount: { type: Number },
        startDate: { type: Date },
        endDate: { type: Date },
    }]
});

const InvestmentModel = mongoose.model('Investment', investmentSchema);

module.exports = InvestmentModel;
