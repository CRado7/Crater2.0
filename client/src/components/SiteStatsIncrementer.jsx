import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { INCREMENT_SITE_STATS } from '../utils/mutations';
import Cookies from 'js-cookie'; // Import js-cookie

const SiteStatsIncrementer = () => {
  const [incrementSiteStats] = useMutation(INCREMENT_SITE_STATS);

  useEffect(() => {
    const incrementStats = async () => {
      const sessionId = Cookies.get('session_id');
      console.log('Session ID:', sessionId);
  
      if (!sessionId) {
        try {
          const { data } = await incrementSiteStats();
          console.log('Increment site stats response:', data);
  
          const newSessionId = Math.random().toString(36).substr(2, 9); // Generate random session ID
          Cookies.set('session_id', newSessionId, { expires: 1 });
        } catch (err) {
          console.error('Failed to increment site stats:', err.message);
          console.error('Error details:', err);
        }
      }
    };
  
    incrementStats();
  }, [incrementSiteStats]);

  return null; // This component doesn't need to render anything
};

export default SiteStatsIncrementer;
