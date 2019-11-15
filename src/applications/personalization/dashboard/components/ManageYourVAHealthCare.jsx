import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';

import {
  recordDashboardClick,
  renderWidgetDowntimeNotification,
} from '../helpers';

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

const ManageYourVAHealthCare = ({
  applicationDate,
  enrollmentDate,
  isEnrolledInHealthCare,
  preferredFacility,
  showServerError,
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
    {isEnrolledInHealthCare && <ScheduleAnAppointmentWidget />}
  </>
);

const mapStateToProps = state => {
  const isEnrolledInHealthCare = isEnrolledInVAHealthCare(state);
  const hcaEnrollmentStatus = selectEnrollmentStatus(state);
  const showServerError = hasESRServerError(state);
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
  };
};

export { ManageYourVAHealthCare };

export default connect(mapStateToProps)(ManageYourVAHealthCare);
