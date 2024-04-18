import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const useGaTracker = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize('G-GHT1W1WLLF');
    // Track the pageview with the current path
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);
};

export default useGaTracker;
