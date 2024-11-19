const mongoose = require('mongoose');

const siteStatsSchema = new mongoose.Schema({
  totalViews: {
    type: Number,
    default: 0,
  },
  uniqueVisits: {
    type: Number,
    default: 0,
  },
  uniqueSessions: {
    type: [String], // Array to store unique session IDs
    default: [],
  },
});

const SiteStats = mongoose.model('SiteStats', siteStatsSchema);
module.exports = SiteStats;

