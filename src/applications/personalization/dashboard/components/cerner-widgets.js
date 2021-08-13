import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import { mhvUrl } from 'platform/site-wide/mhv/utilities';
import { getCernerURL } from 'platform/utilities/cerner';
import { externalRedirects } from 'platform/user/authentication/utilities';

// Returns an AlertBox to present the user with info about working with the
// Cerner facility they are enrolled at. Props allow you to edit a small amount
// of the content that is rendered in the AlertBox.
const CernerAlertBox = ({
  primaryCtaButtonUrl,
  secondaryCtaButtonText,
  secondaryCtaButtonUrl,
  facilityNames,
  level = 2,
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
          return <strong key={i}>{el}</strong>;
        })}
      </>
    );
  };

  return (
    <AlertBox
      status="warning"
      headline="Choose your health management portal"
      level={level}
    >
      <p>
        Your care team may now use our new My VA Health portal. Choose your
        portal based on the facility for your appointment:
      </p>
      <p>
        <strong className="vads-u-font-family--sans">
          <strong>For </strong>
          <FacilityList facilities={facilityNames} separator=" or " />:{' '}
        </strong>
        <a href={primaryCtaButtonUrl} rel="noopener noreferrer" target="_blank">
          Use My VA Health
        </a>
      </p>
      <p>
        <strong className="vads-u-font-family--sans">
          For any other VA health facility:{' '}
        </strong>
        <a href={secondaryCtaButtonUrl}>{secondaryCtaButtonText}</a>
      </p>
      <p>
        <strong>If you have trouble accessing the portal: </strong> Make sure to
        disable your pop-up blocker. If you’re prompted to sign in again, use
        the same account you used to sign in to VA.gov.
      </p>
    </AlertBox>
  );
};

export const CernerScheduleAnAppointmentWidget = ({ facilityNames }) => (
  <div data-testid="cerner-appointment-widget">
    <h3>View, schedule, or cancel an appointment</h3>
    <CernerAlertBox
      primaryCtaButtonUrl={getCernerURL('/pages/scheduling/upcoming')}
      secondaryCtaButtonText="Use My HealtheVet"
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
      secondaryCtaButtonText="Use My HealtheVet"
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
      secondaryCtaButtonText="Use My HealtheVet"
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
      secondaryCtaButtonText="Use My HealtheVet"
      secondaryCtaButtonUrl={mhvUrl(authenticatedWithSSOe, 'home')}
      level={2}
    />
  </div>
);
