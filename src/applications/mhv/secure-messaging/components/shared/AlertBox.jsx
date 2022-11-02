/**
 * Alert Box component with status header
 *
 * @author Vic Saleem
 * @desc: Alert that displays a headline and message content
 * @notes :
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { closeAlert } from '../../actions/alerts';

const AlertBox = () => {
  const dispatch = useDispatch();
  const alertVisible = useSelector(state => state.sm.alerts?.alertVisible);
  const alertList = useSelector(state => state.sm.alerts?.alertList);
  const [activeAlert, setActiveAlert] = useState(true);

  useEffect(
    () => {
      if (alertList?.length) {
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
      }
    },
    [alertList],
  );
  const closeAlertBox = () => {
    dispatch(closeAlert());
  };

  return (
    alertVisible &&
    activeAlert && (
      <VaAlert
        key={null}
        status={activeAlert.alertType}
        visible
        onCloseEvent={closeAlertBox}
        class="vads-u-margin-y--4"
      >
        <h2 slot="headline">{activeAlert.header}</h2>
        <p>{activeAlert.content}</p>
      </VaAlert>
    )
  );
};

export default AlertBox;
