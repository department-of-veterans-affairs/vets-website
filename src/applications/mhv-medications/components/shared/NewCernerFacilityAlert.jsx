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
      trigger="New: Manage your health care on VA.gov"
    >
      <div data-testid="new-cerner-health-facility-text">
        <p>
          You can now manage your care for any VA health facility right here in
          myHeatheVet on VA.gov.
        </p>
        <p>
          <strong>Note:</strong> You can also still access the My VA Health
          portal at this time.
        </p>
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
