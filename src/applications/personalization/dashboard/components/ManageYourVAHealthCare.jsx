import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import environment from 'platform/utilities/environment';

import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import { mhvUrl } from 'platform/site-wide/mhv/utilities';
import backendServices from 'platform/user/profile/constants/backendServices';
import { isAuthenticatedWithSSOe } from 'platform/user/authentication/selectors';
import {
  selectCernerAppointmentsFacilities,
  selectCernerMessagingFacilities,
  selectCernerRxFacilities,
} from 'platform/user/selectors';

import {
  recordDashboardClick,
  renderWidgetDowntimeNotification,
} from '../helpers';

import MessagingWidget from '../containers/MessagingWidget';
import PrescriptionsWidget from '../containers/PrescriptionsWidget';
import ESRError, { ESR_ERROR_TYPES } from './ESRError';

import {
  hasServerError as hasESRServerError,
  isEnrolledInVAHealthCare,
  selectEnrollmentStatus,
} from 'applications/hca/selectors';
import { getEnrollmentDetails } from 'applications/hca/enrollment-status-helpers';

// Returns an AlertBox to present the user with info about working with the
// Cerner facility they are enrolled at. Props allow you to edit a small amount
// of the content that is rendered in the AlertBox.
const CernerAlertBox = ({
  ctaButtonText,
  ctaButtonUrl,
  ctaText,
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
      <h4>
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
      <h3>{ctaText}</h3>
      <h4>
        <FacilityList facilities={facilityNames} separator=" or " />
      </h4>
      <a
        href={
          environment.isProduction()
            ? 'https://patientportal.myhealth.va.gov/'
            : 'https://ehrm-va-test.patientportal.us.healtheintent.com/'
        }
        type="button"
        className="usa-button-primary"
        rel="noopener noreferrer"
        target="_blank"
      >
        Go to My VA Health
      </a>
      <h4>Another VA health facility</h4>
      <a href={ctaButtonUrl} type="button" className="usa-button-secondary">
        {ctaButtonText}
      </a>
    </AlertBox>
  );
};

const ScheduleAnAppointmentWidget = () => (
  <div id="rx-widget">
    <h3>Schedule an appointment</h3>
    <p>
      Find out how to make a doctor’s appointment with a member of your VA
      health care team online or by phone.
    </p>
    <p>
      <a
        href="/health-care/schedule-view-va-appointments/"
        onClick={recordDashboardClick('schedule-appointment')}
      >
        Schedule an appointment
      </a>
    </p>
  </div>
);

const CernerScheduleAnAppointmentWidget = ({ facilityNames }) => (
  <>
    <h3>View, schedule, or cancel an appointment</h3>
    <CernerAlertBox
      ctaText="Manage appointments at:"
      ctaButtonText="Go to the VA appointments tool"
      ctaButtonUrl="/health-care/schedule-view-va-appointments/"
      facilityNames={facilityNames}
    />
  </>
);

const CernerSecureMessagingWidget = ({
  facilityNames,
  authenticatedWithSSOe,
}) => (
  <>
    <h3>Send or receive a secure message</h3>
    <CernerAlertBox
      ctaText="Send a secure message to a provider at:"
      ctaButtonText="Go to My HealtheVet"
      ctaButtonUrl={mhvUrl(authenticatedWithSSOe, 'secure-messaging')}
      facilityNames={facilityNames}
    />
  </>
);

const CernerPrescriptionsWidget = ({
  facilityNames,
  authenticatedWithSSOe,
}) => (
  <>
    <h3>Refill and track prescriptions</h3>
    <CernerAlertBox
      ctaText="Refill prescriptions from:"
      ctaButtonText="Go to My HealtheVet"
      ctaButtonUrl={mhvUrl(
        authenticatedWithSSOe,
        'web/myhealthevet/refill-prescriptions',
      )}
      facilityNames={facilityNames}
    />
  </>
);

const ManageYourVAHealthCare = ({
  applicationDate,
  appointmentFacilityNames,
  messagingFacilityNames,
  prescriptionFacilityNames,
  authenticatedWithSSOe,
  enrollmentDate,
  isEnrolledInHealthCare,
  preferredFacility,
  showServerError,
  showCernerAppointmentWidget,
  showCernerMessagingWidget,
  showCernerPrescriptionWidget,
}) => (
  <>
    <h2>Manage your VA health care</h2>
    {showServerError && <ESRError errorType={ESR_ERROR_TYPES.inContext} />}
    <AlertBox
      content={
        <div>
          <h3 className="usa-alert-heading">
            You are enrolled in VA Health Care
          </h3>
          {getEnrollmentDetails(
            applicationDate,
            enrollmentDate,
            preferredFacility,
          )}
          <p>
            <a
              href="/health-care/about-va-health-benefits/#health-about-basic"
              onClick={recordDashboardClick('learn-more-va-health-benefits')}
            >
              Learn more about your VA health benefits
            </a>
          </p>
          <p>
            <a
              href="/find-locations/"
              onClick={recordDashboardClick('find-nearest-va-health-facility')}
            >
              Find your nearest VA health facility
            </a>
          </p>
        </div>
      }
      status="info"
      isVisible={isEnrolledInHealthCare}
      className="background-color-only"
    />

    {!showCernerMessagingWidget && (
      <DowntimeNotification
        appTitle="messaging"
        dependencies={[externalServices.mvi, externalServices.mhv]}
        render={renderWidgetDowntimeNotification(
          'Secure messaging',
          'Track Secure Messages',
        )}
      >
        <MessagingWidget />
      </DowntimeNotification>
    )}
    {showCernerMessagingWidget && (
      <CernerSecureMessagingWidget
        facilityNames={messagingFacilityNames}
        authenticatedWithSSOe={authenticatedWithSSOe}
      />
    )}

    {!showCernerPrescriptionWidget && (
      <DowntimeNotification
        appTitle="rx"
        dependencies={[externalServices.mvi, externalServices.mhv]}
        render={renderWidgetDowntimeNotification(
          'prescription refill',
          'Refill Prescriptions',
        )}
      >
        <PrescriptionsWidget />
      </DowntimeNotification>
    )}
    {showCernerPrescriptionWidget && (
      <CernerPrescriptionsWidget
        facilityNames={prescriptionFacilityNames}
        authenticatedWithSSOe={authenticatedWithSSOe}
      />
    )}

    {isEnrolledInHealthCare &&
      !showCernerAppointmentWidget && <ScheduleAnAppointmentWidget />}
    {showCernerAppointmentWidget && (
      <CernerScheduleAnAppointmentWidget
        facilityNames={appointmentFacilityNames}
      />
    )}
  </>
);

const mapStateToProps = state => {
  const isEnrolledInHealthCare = isEnrolledInVAHealthCare(state);
  const hcaEnrollmentStatus = selectEnrollmentStatus(state);

  const showServerError = hasESRServerError(state);
  const profileState = state.user.profile;
  const canAccessMessaging = profileState.services.includes(
    backendServices.MESSAGING,
  );
  const canAccessPrescriptions = profileState.services.includes(
    backendServices.RX,
  );

  const cernerAppointmentFacilities = selectCernerAppointmentsFacilities(state);
  const cernerMessagingFacilities = selectCernerMessagingFacilities(state);
  const cernerPrescriptionFacilities = selectCernerRxFacilities(state);

  const appointmentFacilityNames = cernerAppointmentFacilities?.map(facility =>
    getMedicalCenterNameByID(facility.facilityId),
  );
  const messagingFacilityNames = cernerMessagingFacilities?.map(facility =>
    getMedicalCenterNameByID(facility.facilityId),
  );
  const prescriptionFacilityNames = cernerPrescriptionFacilities?.map(
    facility => getMedicalCenterNameByID(facility.facilityId),
  );

  const {
    applicationDate,
    enrollmentDate,
    preferredFacility,
  } = hcaEnrollmentStatus;

  return {
    applicationDate,
    enrollmentDate,
    isEnrolledInHealthCare,
    preferredFacility,
    showServerError,
    showCernerAppointmentWidget:
      isEnrolledInHealthCare && !!cernerAppointmentFacilities.length,
    showCernerMessagingWidget:
      canAccessMessaging && !!cernerMessagingFacilities.length,
    showCernerPrescriptionWidget:
      canAccessPrescriptions && !!cernerPrescriptionFacilities.length,
    appointmentFacilityNames,
    messagingFacilityNames,
    prescriptionFacilityNames,
    authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
  };
};

export { ManageYourVAHealthCare };

export default connect(mapStateToProps)(ManageYourVAHealthCare);
