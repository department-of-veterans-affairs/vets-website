import React from 'react';
import PropTypes from 'prop-types';
import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import { getCernerURL } from '~/platform/utilities/cerner';
import { Toggler } from '~/platform/utilities/feature-toggles';

const SeparatorSpan = ({ children }) => (
  <span className="vads-u-font-weight--normal vads-u-font-size--base">
    {children}
  </span>
);

SeparatorSpan.propTypes = {
  children: PropTypes.node,
};

// Helper component that takes an array of facility names and a separator string and returns some JSX to style the list of facility names.
const FacilityList = ({ facilities, separator, finalSeparator }) => {
  return (
    <>
      {facilities.map((facility, i, orig) => {
        return (
          <strong key={i}>
            {facility}
            {facility !== orig.at(-2) && facility !== orig.at(-1) && (
              <SeparatorSpan>{separator}</SeparatorSpan>
            )}
            {facility === orig.at(-2) && (
              <SeparatorSpan>{finalSeparator}</SeparatorSpan>
            )}
          </strong>
        );
      })}
    </>
  );
};

FacilityList.propTypes = {
  facilities: PropTypes.arrayOf(PropTypes.string).isRequired,
  separator: PropTypes.string.isRequired,
  finalSeparator: PropTypes.string,
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
          Your care team may now use our My VA Health portal. Choose your portal
          based on the facility for your appointment:
        </p>
        <p className="vads-u-font-family--sans" data-testid="facilities">
          For{' '}
          <FacilityList
            facilities={facilityLocations}
            separator=", "
            finalSeparator=", or "
          />
          :{' '}
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

const FacilityListV2 = ({ facilities }) => {
  return (
    <ul>
      {facilities.map((facility, i) => {
        return <li key={i}>{facility}</li>;
      })}
    </ul>
  );
};

FacilityListV2.propTypes = {
  facilities: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const CernerAlertBoxV2 = ({
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
          <FacilityListV2 facilities={facilityLocations} />
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

CernerAlertBoxV2.propTypes = {
  facilityLocations: PropTypes.arrayOf(PropTypes.string),
  primaryCtaButtonUrl: PropTypes.string,
  secondaryCtaButtonText: PropTypes.string,
  secondaryCtaButtonUrl: PropTypes.string,
};

export const CernerWidget = ({ facilityLocations, authenticatedWithSSOe }) => (
  <Toggler
    toggleName={Toggler.TOGGLE_NAMES.vaOnlineSchedulingStaticLandingPage}
  >
    <div data-testid="cerner-widget">
      <Toggler.Enabled>
        <CernerAlertBoxV2
          facilityLocations={facilityLocations}
          primaryCtaButtonUrl={getCernerURL('')}
          secondaryCtaButtonText="Go to My HealtheVet"
          secondaryCtaButtonUrl={mhvUrl(authenticatedWithSSOe, 'home')}
        />
      </Toggler.Enabled>
      <Toggler.Disabled>
        <CernerAlertBox
          facilityLocations={facilityLocations}
          primaryCtaButtonUrl={getCernerURL('')}
          secondaryCtaButtonText="Use My HealtheVet"
          secondaryCtaButtonUrl={mhvUrl(authenticatedWithSSOe, 'home')}
        />
      </Toggler.Disabled>
    </div>
  </Toggler>
);

CernerWidget.propTypes = {
  authenticatedWithSSOe: PropTypes.bool,
  facilityLocations: PropTypes.arrayOf(PropTypes.string),
};
