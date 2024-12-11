// components/servers/ServerControls.jsx
import React from 'react';
import PropTypes from 'prop-types';

const ServerControls = ({
  processName,
  displayName,
  isRunning,
  onStart,
  onStop,
  startConfig,
  stopPort,
}) => {
  return (
    <div className="vads-l-row vads-u-align-items--center">
      <h2 className="vads-u-font-size--h4 vads-u-margin-y--0 vads-u-font-family--sans vads-u-font-weight--bold">
        {displayName}
      </h2>
      {isRunning ? (
        <>
          <div className="vads-u-padding-x--1 vads-u-font-style--italic">
            Status: Running{' '}
            <span className="vads-u-color--green vads-u-padding-x--0 vads-u-padding-y--0p25">
              <va-icon icon="check_circle" size={3} />
            </span>
          </div>
          <va-button
            className="usa-button usa-button-secondary"
            onClick={() => onStop(processName, stopPort)}
            text="stop process"
            secondary
          />
        </>
      ) : (
        <>
          <div className="vads-u-padding-x--1 vads-u-font-style--italic">
            Status: Stopped <va-icon icon="report" size={2} />
          </div>
          <va-button
            className="usa-button"
            onClick={() => onStart(processName, startConfig)}
            text="start process"
            secondary
          />
        </>
      )}
    </div>
  );
};

ServerControls.propTypes = {
  displayName: PropTypes.string.isRequired,
  isRunning: PropTypes.bool.isRequired,
  processName: PropTypes.string.isRequired,
  startConfig: PropTypes.object.isRequired,
  stopPort: PropTypes.number.isRequired,
  onStart: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
};

export default ServerControls;
