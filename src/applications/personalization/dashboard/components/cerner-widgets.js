import React, { Fragment } from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import { mhvUrl } from 'platform/site-wide/mhv/utilities';
import { getCernerURL } from 'platform/utilities/cerner';
import { externalRedirects } from 'platform/user/authentication/utilities';

// Returns an AlertBox to present the user with info about working with the
// Cerner facility they are enrolled at. Props allow you to edit a small amount
// of the content that is rendered in the AlertBox.
const CernerAlertBox = ({
  primaryCtaText,
  primaryCtaButtonUrl,
  secondaryCtaButtonText,
  secondaryCtaButtonUrl,
  facilityNames,
}) => {
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
          return <Fragment key={i}>{el}</Fragment>;
        })}
      </>
    );
  };

  return (
    <AlertBox
      status="warning"
      headline="Your VA health care team may be using our new My VA Health portal"
    >
      <h3>Our records show you’re registered at:</h3>
      <h4 className="vads-u-font-family--sans">
        <FacilityList facilities={facilityNames} separator=" and " />
        <span className="vads-u-font-weight--normal vads-u-font-size--base">
          {' '}
          (Using My VA Health)
        </span>
      </h4>
      <p>
        Please choose a health management portal below, depending on the
        facility for your appointment. You may need to disable your browser’s
        pop-up blocker to open the portal. If you’re prompted to sign in again,
        use the same account you used to sign in on VA.gov.
      </p>
      <h3>{primaryCtaText}</h3>
      <h4 className="vads-u-font-family--sans">
        <FacilityList facilities={facilityNames} separator=" or " />
      </h4>
      <a
        href={primaryCtaButtonUrl}
        type="button"
        className="usa-button-primary"
        rel="noopener noreferrer"
        target="_blank"
      >
        Go to My VA Health
      </a>
      <h4 className="vads-u-font-family--sans">Another VA health facility</h4>
      <a
        href={secondaryCtaButtonUrl}
        type="button"
        className="usa-button-secondary"
      >
        {secondaryCtaButtonText}
      </a>
    </AlertBox>
  );
};

export const CernerScheduleAnAppointmentWidget = ({ facilityNames }) => (
  <div data-testid="cerner-appointment-widget">
    <h3>View, schedule, or cancel an appointment</h3>
    <CernerAlertBox
      primaryCtaButtonUrl={getCernerURL('/pages/scheduling/upcoming')}
      primaryCtaText="Manage appointments at:"
      secondaryCtaButtonText="Go to the VA appointments tool"
      secondaryCtaButtonUrl="/health-care/schedule-view-va-appointments/"
      facilityNames={facilityNames}
    />
  </div>
);

export const CernerSecureMessagingWidget = ({
  facilityNames,
  authenticatedWithSSOe,
}) => (
  <div data-testid="cerner-messaging-widget">
    <h3>Send or receive a secure message</h3>
    <CernerAlertBox
      primaryCtaButtonUrl={getCernerURL('/pages/messaging/inbox')}
      primaryCtaText="Send a secure message to a provider at:"
      secondaryCtaButtonText="Go to My HealtheVet"
      secondaryCtaButtonUrl={mhvUrl(authenticatedWithSSOe, 'secure-messaging')}
      facilityNames={facilityNames}
    />
  </div>
);

export const CernerPrescriptionsWidget = ({
  facilityNames,
  authenticatedWithSSOe,
}) => (
  <div data-testid="cerner-prescription-widget">
    <h3>Refill and track prescriptions</h3>
    <CernerAlertBox
      primaryCtaButtonUrl={getCernerURL('/pages/medications/current')}
      primaryCtaText="Refill prescriptions from:"
      secondaryCtaButtonText="Go to My HealtheVet"
      secondaryCtaButtonUrl={mhvUrl(
        authenticatedWithSSOe,
        'web/myhealthevet/refill-prescriptions',
      )}
      facilityNames={facilityNames}
    />
  </div>
);

export const GeneralCernerWidget = ({
  facilityNames,
  authenticatedWithSSOe,
}) => (
  <div data-testid="cerner-widget">
    <CernerAlertBox
      facilityNames={facilityNames}
      primaryCtaButtonUrl={externalRedirects.myvahealth}
      primaryCtaText="Manage health care at:"
      secondaryCtaButtonText="Go to My HealtheVet"
      secondaryCtaButtonUrl={mhvUrl(authenticatedWithSSOe, 'home')}
    />
  </div>
);
