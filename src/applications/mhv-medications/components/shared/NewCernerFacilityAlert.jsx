import React, { useState } from 'react';
import { getCernerURL } from 'platform/utilities/cerner';
import PropTypes from 'prop-types';

const NewCernerFacilityAlert = ({ apiError, className = '' }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <va-alert
      class={`${className} vads-u-margin-bottom--2p5 
      ${
        // Need extra padding if both alerts appear
        apiError ? 'vads-u-margin-top--2' : ''
      }`}
      onClick={() => setMenuOpen(!menuOpen)}
      data-testid="new-cerner-facilities-alert"
      aria-expanded={menuOpen}
      status="info"
    >
      <strong>New: Manage your health care on VA.gov</strong>
      <va-icon
        data-testid="new-cerner-facility-alert-toggle"
        size={3}
        icon={!menuOpen ? 'expand_more' : 'expand_less'}
        aria-hidden="true"
      />
      {menuOpen && (
        <>
          <p data-testid="new-cerner-health-facility-text">
            You can now manage your care for any VA health facility right here
            in myHeatheVet on VA.gov.
          </p>
          <p>
            <strong>Note:</strong> You can also still access the My VA Health
            portal at this time.
          </p>
          <a href={getCernerURL('/pages/medications/current', true)}>
            Go to My VA Health
          </a>
        </>
      )}
    </va-alert>
  );
};

NewCernerFacilityAlert.propTypes = {
  className: PropTypes.string,
  apiError: PropTypes.bool,
};

export default NewCernerFacilityAlert;
