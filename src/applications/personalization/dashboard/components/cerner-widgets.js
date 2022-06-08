import React from 'react';
import PropTypes from 'prop-types';
import { mhvUrl } from 'platform/site-wide/mhv/utilities';
import { getCernerURL } from 'platform/utilities/cerner';

// Helper component that takes an array of facility names and a separator string and returns some JSX to style the list of facility names.
const FacilityList = ({ facilities, separator }) => {
  const newArray = [];
  // first make an array that alternates between a facility name and the
  // separator word wrapped in a <span> for styling purposes
  facilities.forEach(el => {
    newArray.push(el);
    newArray.push(
      <span className="vads-u-font-weight--normal vads-u-font-size--base">
        {separator}
      </span>,
    );
  });
  // we don't need the last separator in the array
  newArray.pop();
  // Then map over the array we just made, converting it to JSX
  return (
    <>
      {newArray.map((el, i) => {
        return <strong key={i}>{el}</strong>;
      })}
    </>
  );
};

FacilityList.propTypes = {
  facilities: PropTypes.arrayOf(PropTypes.string),
  separator: PropTypes.string,
};

// Returns an AlertBox to present the user with info about working with the
// Cerner facility they are enrolled at. Props allow you to edit a small amount
// of the content that is rendered in the AlertBox.
const CernerAlertBox = ({
  primaryCtaButtonUrl,
  secondaryCtaButtonText,
  secondaryCtaButtonUrl,
  facilityLocations,
}) => {
  return (
    <va-alert status="warning">
      <h2 slot="headline">Choose your health management portal</h2>
      <div>
        <p>
          Your care team may now use our new My VA Health portal. Choose your
          portal based on the facility for your appointment:
        </p>
        <p className="vads-u-font-family--sans" data-testid="facilities">
          For <FacilityList facilities={facilityLocations} separator=" or " />:{' '}
          <a
            href={primaryCtaButtonUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Use My VA Health (opens in new tab)
          </a>
        </p>
        <p>
          For{' '}
          <strong className="vads-u-font-family--sans">
            any other VA health facility:{' '}
          </strong>
          <a href={secondaryCtaButtonUrl}>{secondaryCtaButtonText}</a>
        </p>
        <p>
          If you have trouble accessing the portal, make sure to disable your
          pop-up blocker. If you’re prompted to sign in again, use the same
          account you used to sign in to VA.gov.
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
      secondaryCtaButtonText="Use My HealtheVet"
      secondaryCtaButtonUrl={mhvUrl(authenticatedWithSSOe, 'home')}
    />
  </div>
);

CernerWidget.propTypes = {
  authenticatedWithSSOe: PropTypes.bool,
  facilityLocations: PropTypes.arrayOf(PropTypes.string),
};
