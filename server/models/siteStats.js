const mongoose = require('mongoose');

const siteStatsSchema = new mongoose.Schema({
  totalVisitors: {
    type: Number,
    default: 0,
  },
  monthlyVisitors: [
    {
      month: String,
      count: Number,
    }
  ],
});

const SiteStats = mongoose.model('SiteStats', siteStatsSchema);
module.exports = SiteStats;
