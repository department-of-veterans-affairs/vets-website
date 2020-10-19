import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import environment from 'platform/utilities/environment';

import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import {
  recordDashboardClick,
  renderWidgetDowntimeNotification,
} from '../helpers';

import { selectCernerAppointmentsFacilities } from 'platform/user/selectors';

import MessagingWidget from '../containers/MessagingWidget';
import PrescriptionsWidget from '../containers/PrescriptionsWidget';
import ESRError, { ESR_ERROR_TYPES } from './ESRError';

import {
  hasServerError as hasESRServerError,
  isEnrolledInVAHealthCare,
  selectEnrollmentStatus,
} from 'applications/hca/selectors';
import { getEnrollmentDetails } from 'applications/hca/enrollment-status-helpers';

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

const ScheduleAnAppointmentCernerWidget = () => (
  <>
    <h3>Schedule an appointment</h3>
    <AlertBox
      status="warning"
      headline="Your VA health care team may be using our new My VA Health portal"
    >
      <h3>Our records show you’re registered at:</h3>
      <h4>
        Chalmers P. Wylie Veteran Outpatient Clinic{' '}
        <span className="vads-u-font-weight--normal vads-u-font-size--base">
          (Now using My VA Health)
        </span>
      </h4>
      <p>
        Please choose a health management portal below, depending on the
        facility for your appointment. You may need to disable your browser’s
        pop-up blocker to open the portal. If you’re prompted to sign in again,
        use the same account you used to sign in on VA.gov.
      </p>
      <h3>Manage appointments at:</h3>
      <h4>Chalmers P. Wylie Veteran Outpatient Clinic</h4>
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
      <a
        href="/health-care/schedule-view-va-appointments/"
        type="button"
        className="usa-button-secondary"
      >
        Go to the VA appointments tool
      </a>
    </AlertBox>
  </>
);

const ManageYourVAHealthCare = ({
  applicationDate,
  enrollmentDate,
  isEnrolledInHealthCare,
  preferredFacility,
  showServerError,
  showCernerAppointmentWidget,
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
    {isEnrolledInHealthCare &&
      !showCernerAppointmentWidget && <ScheduleAnAppointmentWidget />}
    {isEnrolledInHealthCare &&
      showCernerAppointmentWidget && <ScheduleAnAppointmentCernerWidget />}
  </>
);

const mapStateToProps = state => {
  const isEnrolledInHealthCare = isEnrolledInVAHealthCare(state);
  const hcaEnrollmentStatus = selectEnrollmentStatus(state);
  const showServerError = hasESRServerError(state);
  const showCernerAppointmentWidget = !!selectCernerAppointmentsFacilities(
    state,
  )?.length;
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
    showCernerAppointmentWidget,
  };
};

export { ManageYourVAHealthCare };

export default connect(mapStateToProps)(ManageYourVAHealthCare);
