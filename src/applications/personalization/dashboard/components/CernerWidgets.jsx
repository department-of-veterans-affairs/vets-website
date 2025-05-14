import React from 'react';
import PropTypes from 'prop-types';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { getCernerURL } from '~/platform/utilities/cerner';

const FacilityList = ({ facilities }) => {
  return (
    <ul>
      {facilities.map((facility, i) => {
        return <li key={i}>{facility}</li>;
      })}
    </ul>
  );
};

FacilityList.propTypes = {
  facilities: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const CernerAlertBox = ({
  primaryCtaButtonUrl,
  secondaryCtaButtonText,
  secondaryCtaButtonUrl,
  facilityLocations,
}) => {
  return (
    <va-alert status="warning">
      <h2 slot="headline">Choose the right health portal</h2>
      <div>
        <p className="vads-u-font-family--sans">
          <strong>
            To manage your health care at these facilities, go to My VA Health:
          </strong>
        </p>
        <div data-testid="facilities">
          <FacilityList facilities={facilityLocations} />
          <a
            href={primaryCtaButtonUrl}
            rel="noopener noreferrer"
            target="_blank"
            className="vads-c-action-link--blue vads-u-margin-bottom--1"
          >
            Go to My VA Health
          </a>
          <va-additional-info trigger="Having trouble opening My VA Health?">
            <p>Try these steps:</p>
            <ul>
              <li>Disable your browser’s pop-up blocker</li>
              <li>
                Sign in to My VA Health with the same account you used to sign
                in to VA.gov
              </li>
            </ul>
          </va-additional-info>
        </div>
        <p className="vads-u-font-family--sans">
          <strong>For any other facility, go to My HealtheVet.</strong>
        </p>
        <p>
          <a href={secondaryCtaButtonUrl} className="vads-c-action-link--blue">
            {secondaryCtaButtonText}
          </a>
        </p>
      </div>
    </va-alert>
  );
};

CernerAlertBox.propTypes = {
  facilityLocations: PropTypes.arrayOf(PropTypes.string),
  primaryCtaButtonUrl: PropTypes.string,
  secondaryCtaButtonText: PropTypes.string,
  secondaryCtaButtonUrl: PropTypes.string,
};

export const CernerWidget = ({ facilityLocations, authenticatedWithSSOe }) => (
  <div data-testid="cerner-widget">
    <CernerAlertBox
      facilityLocations={facilityLocations}
      primaryCtaButtonUrl={getCernerURL('')}
      secondaryCtaButtonText="Go to My HealtheVet"
      secondaryCtaButtonUrl={mhvUrl(authenticatedWithSSOe, 'home')}
    />
  </div>
);

CernerWidget.propTypes = {
  authenticatedWithSSOe: PropTypes.bool,
  facilityLocations: PropTypes.arrayOf(PropTypes.string),
};
