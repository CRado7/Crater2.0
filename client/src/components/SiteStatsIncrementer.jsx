import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { INCREMENT_SITE_STATS } from '../utils/mutations';
import Cookies from 'js-cookie'; // Import js-cookie

const SiteStatsIncrementer = () => {
  const [incrementSiteStats] = useMutation(INCREMENT_SITE_STATS);

  useEffect(() => {
    const incrementStats = async () => {
      // Check if a session ID exists in cookies
      const sessionId = Cookies.get('session_id');

      if (!sessionId) {
        try {
          // If no session ID exists, trigger the mutation
          await incrementSiteStats();
          
          // Store a session ID in cookies to track this session
          const newSessionId = Math.random().toString(36).substr(2, 9); // Create a random session ID
          Cookies.set('session_id', newSessionId, { expires: 1 }); // Save the session ID in cookies for 1 day
        } catch (err) {
          console.error('Failed to increment site stats:', err);
        }
      }
    };

    incrementStats();
  }, [incrementSiteStats]);

  return null; // This component doesn't need to render anything
};

export default SiteStatsIncrementer;
