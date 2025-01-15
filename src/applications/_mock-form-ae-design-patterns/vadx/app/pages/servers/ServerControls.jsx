// components/servers/ServerControls.jsx
import React from 'react';
import PropTypes from 'prop-types';

const ServerControls = ({ processName, displayName, isRunning, onStart }) => {
  return (
    <div className="vads-l-row vads-u-align-items--center">
      <h2 className="vads-u-font-size--h4 vads-u-margin-y--0 vads-u-font-family--sans vads-u-font-weight--bold">
        {displayName}
      </h2>
      <>
        <div className="vads-u-padding-x--1 vads-u-font-style--italic">
          {isRunning ? (
            <>
              Process: Running{' '}
              <span className="vads-u-color--green vads-u-padding-x--0 vads-u-padding-y--0p25">
                <va-icon
                  icon="check_circle"
                  size={3}
                  srtext="server is running"
                />
              </span>
            </>
          ) : (
            <>
              Status: Stopped{' '}
              <span className="vads-u-color--error vads-u-padding-x--0 vads-u-padding-y--0p25">
                <va-icon
                  icon="report"
                  size={3}
                  srtext="server is not running"
                />
              </span>
            </>
          )}
        </div>
        <va-button
          className="usa-button"
          onClick={() => onStart(processName)}
          text={`${isRunning ? 'Configure' : 'Start'} ${processName}`}
          secondary
        />
      </>
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
