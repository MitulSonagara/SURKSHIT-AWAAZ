const mongoose = require('mongoose')
const station = require("./stations")
const moment = require('moment-timezone');

const feedbackResponseSchema = new mongoose.Schema({
    stationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: station
    },
    feedback: [
        {
            questionText: String,
            response: String,
        },
    ],
    remarks: String,
    type: String,
    date: String,
    time: String,

})

feedbackResponseSchema.pre('save', function (next) {
    // Set the Indian time zone (Asia/Kolkata)
    const indianTimezone = 'Asia/Kolkata';

    // Format the current date and time
    const currentDatetime = moment().tz(indianTimezone).format('DD-MM-YYYY HH:mm:ss');

    this.date = currentDatetime.split(' ')[0];
    this.time = currentDatetime.split(' ')[1];

    next();
});

module.exports = mongoose.model('feedbackResponses2', feedbackResponseSchema);