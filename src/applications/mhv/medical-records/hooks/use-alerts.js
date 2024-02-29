import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useAlerts = () => {
  const alertList = useSelector(state => state.mr.alerts?.alertList);
  const [activeAlert, setActiveAlert] = useState();

  useEffect(
    () => {
      const filteredSortedAlerts = alertList
        .filter(alert => alert.isActive)
        .sort((a, b) => {
          // Sort chronologically descending.
          return b.datestamp - a.datestamp;
        });
      if (filteredSortedAlerts.length > 0) {
        // The activeAlert is the most recent alert marked as active.
        setActiveAlert(filteredSortedAlerts[0]);
      }
    },
    [alertList],
  );

  return activeAlert;
};

export default useAlerts;
