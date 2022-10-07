import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { closeAlert } from '../../actions/alerts';

const AlertBackgroundBox = props => {
  const dispatch = useDispatch();
  const alertVisible = useSelector(state => state.sm.alerts?.alertVisible);
  const alertList = useSelector(state => state.sm.alerts?.alertList);
  const [activeAlert, setActiveAlert] = useState(null);

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

  return alertVisible && activeAlert ? (
    <VaAlert
      background-only
      closeable={props.closeable}
      class="vads-u-margin-bottom--1"
      close-btn-aria-label="Close notification"
      disable-analytics="false"
      full-width="false"
      show-icon
      status={activeAlert.alertType} // success, error, warning, info, continue
      onCloseEvent={closeAlertBox}
    >
      <div>
        <p className="vads-u-margin-y--0">{activeAlert.content}</p>
      </div>
    </VaAlert>
  ) : (
    <></>
  );
};

AlertBackgroundBox.propTypes = {
  closeable: PropTypes.bool,
};

export default AlertBackgroundBox;
