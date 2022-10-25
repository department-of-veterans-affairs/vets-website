import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import { closeAlert } from '../../actions/alerts';

const AlertBackgroundBox = props => {
  const dispatch = useDispatch();
  const alertVisible = useSelector(state => state.sm.alerts?.alertVisible);
  const alertList = useSelector(state => state.sm.alerts?.alertList);
  const [activeAlert, setActiveAlert] = useState(null);
  const alertRef = useRef();

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
      ref={alertRef}
      background-only
      closeable={props.closeable}
      className="vads-u-margin-bottom--1 va-alert"
      close-btn-aria-label="Close notification"
      disable-analytics="false"
      full-width="false"
      show-icon
      status={activeAlert.alertType}
      onCloseEvent={
        closeAlertBox // success, error, warning, info, continue
      }
      onVa-component-did-load={() => {
        focusElement(alertRef.current);
      }}
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
