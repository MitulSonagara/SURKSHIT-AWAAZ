const mongoose = require('mongoose');

const stationSchema = mongoose.Schema({
    stationId: String,
    // Existing fields
    name: String,
    district: String,
    latitude: String,
    longitude: String,
});


module.exports = mongoose.model("station", stationSchema);