/**
 * Alert Box component with status header
 *
 * @author Vic Saleem
 * @desc: Alert that displays a headline, message content, and a link
 * @notes :
 */

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const AlertBox = () => {
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

  return (
    alertVisible &&
    activeAlert && (
      <VaAlert
        key={null}
        status={activeAlert.alertType}
        visible
        class="vads-u-margin-y--4"
      >
        <h2 slot="headline" data-testid="expired-alert-message">
          {activeAlert.header}
        </h2>
        <p>{activeAlert.content}</p>
        <p className="vads-u-margin-top--neg1 vads-u-margin-bottom--1 vads-u-font-weight--bold">
          <Link
            className="alertbox-link"
            aria-label={`${activeAlert.title}`}
            to={`${activeAlert.link}`}
          >
            <i className={activeAlert.className} />
            {activeAlert.title}
          </Link>
        </p>
      </VaAlert>
    )
  );
};

export default AlertBox;
