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

import { selectIsCernerPatient } from 'platform/user/selectors';

// import MessagingWidget from '../containers/MessagingWidget';
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
  <AlertBox
    status="warning"
    headline="Our records show that you’re registered at Chalmers P. Wylie Ambulatory Care Center.  Starting April 10, 2020, providers at this center are using My VA Health to manage appointments."
  >
    <p>
      You may need to sign in again to use VA health appointment tools. If you
      do, sign in with the same account you used to sign in on VA.gov. You may
      need to disable your browser’s pop-up block so these tools can open.
    </p>
    <h4>Manage appointments with Chalmers P. Wylie provider</h4>
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
    <h4>Manage appointments at all other VA Medical center</h4>
    <a
      href="/health-care/schedule-view-va-appointments/"
      type="button"
      className="usa-button-secondary"
    >
      Go to VA appointments
    </a>
  </AlertBox>
);

const ManageYourVAHealthCare = ({
  applicationDate,
  enrollmentDate,
  isEnrolledInHealthCare,
  preferredFacility,
  showServerError,
  showCernerWidget,
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
    {/* hide the messaging widget until this is resolved https://github.com/department-of-veterans-affairs/va.gov-team/issues/3271 */}
    {/* <DowntimeNotification
      appTitle="messaging"
      dependencies={[externalServices.mvi, externalServices.mhv]}
      render={renderWidgetDowntimeNotification(
        'Secure messaging',
        'Track Secure Messages',
      )}
    >
      <MessagingWidget />
    </DowntimeNotification> */}

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
      !showCernerWidget && <ScheduleAnAppointmentWidget />}
    {isEnrolledInHealthCare &&
      showCernerWidget && <ScheduleAnAppointmentCernerWidget />}
  </>
);

const mapStateToProps = state => {
  const isEnrolledInHealthCare = isEnrolledInVAHealthCare(state);
  const hcaEnrollmentStatus = selectEnrollmentStatus(state);
  const showServerError = hasESRServerError(state);
  const showCernerWidget =
    !environment.isProduction() && selectIsCernerPatient(state);
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
    showCernerWidget,
  };
};

export { ManageYourVAHealthCare };

export default connect(mapStateToProps)(ManageYourVAHealthCare);
