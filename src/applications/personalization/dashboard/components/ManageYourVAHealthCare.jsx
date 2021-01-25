import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { getMedicalCenterNameByID } from 'platform/utilities/medical-centers/medical-centers';
import backendServices from 'platform/user/profile/constants/backendServices';
import { isAuthenticatedWithSSOe } from 'platform/user/authentication/selectors';
import {
  isVAPatient as isVAPatientSelector,
  selectCernerAppointmentsFacilities,
  selectCernerMessagingFacilities,
  selectCernerRxFacilities,
} from 'platform/user/selectors';

import {
  hasServerError as hasESRServerError,
  isEnrolledInESR,
  selectEnrollmentStatus,
} from 'applications/hca/selectors';
import { getEnrollmentDetails } from 'applications/hca/enrollment-status-helpers';

import {
  recordDashboardClick,
  renderWidgetDowntimeNotification,
} from '../helpers';

import MessagingWidget from '../containers/MessagingWidget';
import PrescriptionsWidget from '../containers/PrescriptionsWidget';
import ESRError, { ESR_ERROR_TYPES } from './ESRError';
import {
  CernerPrescriptionsWidget,
  CernerScheduleAnAppointmentWidget,
  CernerSecureMessagingWidget,
} from './cerner-widgets';

const ScheduleAnAppointmentWidget = () => (
  <div id="rx-widget" data-testid="non-cerner-appointment-widget">
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

const ManageYourVAHealthCare = ({
  applicationDate,
  appointmentFacilityNames,
  messagingFacilityNames,
  prescriptionFacilityNames,
  authenticatedWithSSOe,
  enrollmentDate,
  isInESR,
  preferredFacility,
  showServerError,
  showNonCernerAppointmentWidget,
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
      isVisible={isInESR}
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

    {showNonCernerAppointmentWidget && <ScheduleAnAppointmentWidget />}
    {showCernerAppointmentWidget && (
      <CernerScheduleAnAppointmentWidget
        facilityNames={appointmentFacilityNames}
      />
    )}
  </>
);

const mapStateToProps = state => {
  // used to decided if an appointment widget is shown
  const isVAPatient = isVAPatientSelector(state);
  // used to decided if the "You Are Enrolled In VA Health Care" alert is shown
  const isInESR = isEnrolledInESR(state);
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
    isInESR,
    preferredFacility,
    showServerError,
    showNonCernerAppointmentWidget:
      isVAPatient && !cernerAppointmentFacilities?.length,
    showCernerAppointmentWidget:
      isVAPatient && !!cernerAppointmentFacilities?.length,
    showCernerMessagingWidget:
      canAccessMessaging && !!cernerMessagingFacilities?.length,
    showCernerPrescriptionWidget:
      canAccessPrescriptions && !!cernerPrescriptionFacilities?.length,
    appointmentFacilityNames,
    messagingFacilityNames,
    prescriptionFacilityNames,
    authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
  };
};

export { ManageYourVAHealthCare };

export default connect(mapStateToProps)(ManageYourVAHealthCare);
