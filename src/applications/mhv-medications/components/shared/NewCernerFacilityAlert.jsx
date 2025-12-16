import React from 'react';
import { getCernerURL } from 'platform/utilities/cerner';
import PropTypes from 'prop-types';

const NewCernerFacilityAlert = ({ apiError, className = '' }) => {
  return (
    <va-alert-expandable
      class={`${className} vads-u-margin-bottom--2p5 
      ${
        // Need extra padding if both alerts appear
        apiError ? 'vads-u-margin-top--2' : ''
      }`}
      data-testid="new-cerner-facilities-alert"
      status="info"
      trigger="You can now manage your medications for all VA facilities right here"
    >
      <div data-testid="new-cerner-health-facility-text">
        <p>
          We’ve brought all your VA health care data together so you can manage
          your care in one place. You no longer need to go to My VA Health to
          manage your prescriptions for any VA facilities.
        </p>
        <p>Still want to use My VA Health for now?</p>
        <a href={getCernerURL('/pages/medications/current', true)}>
          Go to My VA Health
        </a>
      </div>
    </va-alert-expandable>
  );
};

NewCernerFacilityAlert.propTypes = {
  apiError: PropTypes.bool,
  className: PropTypes.string,
};

export default NewCernerFacilityAlert;
