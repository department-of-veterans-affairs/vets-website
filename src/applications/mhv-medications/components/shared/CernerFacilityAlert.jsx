import React from 'react';
import { getCernerURL } from 'platform/utilities/cerner';
import PropTypes from 'prop-types';

const CernerFacilityAlert = ({
  facilitiesNames = [],
  apiError,
  className = '',
}) => {
  const detailsText = () => {
    if (!facilitiesNames) return '';
    if (facilitiesNames?.length > 1) return 'these facilities';
    return facilitiesNames[0];
  };

  return (
    <va-alert
      class={`${className} ${
        facilitiesNames?.length > 0
          ? `vads-u-margin-bottom--2p5 ${
              // Need extra padding if both alerts appear
              apiError ? 'vads-u-margin-top--2' : ''
            }`
          : ''
      }`}
      status="warning"
      visible={facilitiesNames?.length > 0}
      data-testid="cerner-facilities-alert"
    >
      <h2 className="vads-u-font-size--md">
        To manage medications at{' '}
        {facilitiesNames?.length > 1 ? 'these facilities' : 'this facility'}, go
        to My VA Health
      </h2>
      <div>
        <p data-testid="single-cerner-facility-text">
          Some of your medications may be in a different portal. To view or
          manage medications at{' '}
          <span
            className={
              facilitiesNames?.length === 1 ? 'vads-u-font-weight--bold' : ''
            }
          >
            {detailsText()}
          </span>
          , go to My VA Health
          {facilitiesNames?.length > 1 ? ':' : '.'}
        </p>
        {facilitiesNames?.length > 1 && (
          <ul>
            {facilitiesNames.map((facilityName, i) => (
              <li data-testid="cerner-facility" key={i}>
                {facilityName}
              </li>
            ))}
          </ul>
        )}
        <a
          className="vads-c-action-link--blue"
          href={getCernerURL('/pages/medications/current', true)}
        >
          Go to My VA Health
        </a>
        <p className="vads-u-margin-bottom--0">
          <strong>Note:</strong> Having trouble opening up My VA Health? Try
          disabling your browser’s pop-up blocker or signing in to My VA Health
          with the same account you used to sign in to VA.gov.
        </p>
      </div>
    </va-alert>
  );
};

CernerFacilityAlert.propTypes = {
  apiError: PropTypes.bool,
  className: PropTypes.string,
  facilitiesNames: PropTypes.array,
};

export default CernerFacilityAlert;
