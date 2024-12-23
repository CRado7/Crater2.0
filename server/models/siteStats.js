const mongoose = require('mongoose');

const monthlyStatsSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true, // 0 for January, 11 for December
  },
  totalViews: {
    type: Number,
    default: 0,
  },
  uniqueVisits: {
    type: Number,
    default: 0,
  },
  uniqueSessions: {
    type: [String], // Array to store unique session IDs for deduplication
    default: [],
  },
});

const siteStatsSchema = new mongoose.Schema({
  totalViews: {
    type: Number,
    default: 0,
  },
  uniqueVisits: {
    type: Number,
    default: 0,
  },
  monthlyStats: [monthlyStatsSchema], // Embed monthly stats for tracking
});

const SiteStats = mongoose.model('SiteStats', siteStatsSchema);
module.exports = SiteStats;
