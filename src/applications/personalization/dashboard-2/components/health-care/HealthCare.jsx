import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import backendServices from '~/platform/user/profile/constants/backendServices';
import { GeneralCernerWidget } from '~/applications/personalization/dashboard/components/cerner-widgets';
import { fetchFolder as fetchInboxAction } from '~/applications/personalization/dashboard/actions/messaging';
import { recordDashboardClick } from '~/applications/personalization/dashboard/helpers';
import { FOLDER } from '~/applications/personalization/dashboard-2/constants';
import { selectUnreadMessagesCount } from '~/applications/personalization/dashboard-2/selectors';
import { fetchConfirmedFutureAppointments as fetchConfirmedFutureAppointmentsAction } from '~/applications/personalization/appointments/actions';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';
import { getMedicalCenterNameByID } from '~/platform/utilities/medical-centers/medical-centers';
import {
  selectCernerAppointmentsFacilities,
  selectCernerMessagingFacilities,
  selectCernerRxFacilities,
  selectIsCernerPatient,
} from '~/platform/user/selectors';

import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import Appointments from './Appointments';
import NotificationCTA from '../NotificationCTA';

const HealthCare = ({
  appointments,
  authenticatedWithSSOe,
  fetchConfirmedFutureAppointments,
  isCernerPatient,
  facilityNames,
  canAccessMessaging,
  fetchInbox,
  unreadMessagesCount,
  // TODO: possibly remove this prop in favor of mocking API calls in our unit tests
  dataLoadingDisabled = false,
}) => {
  useEffect(
    () => {
      if (!dataLoadingDisabled) {
        fetchConfirmedFutureAppointments();
      }
    },
    [fetchConfirmedFutureAppointments, dataLoadingDisabled],
  );

  useEffect(
    () => {
      if (canAccessMessaging && !dataLoadingDisabled) {
        fetchInbox(FOLDER.inbox);
      }
    },
    [canAccessMessaging, fetchInbox, dataLoadingDisabled],
  );

  const viewMessagesCTA = {
    icon: 'envelope',
    text: unreadMessagesCount
      ? `You have ${unreadMessagesCount} new messages`
      : 'View your new messages',
    href: mhvUrl(authenticatedWithSSOe, 'secure-messaging'),
    ariaLabel: 'View your unread messages',
  };

  if (isCernerPatient && facilityNames?.length) {
    return (
      <GeneralCernerWidget
        facilityNames={facilityNames}
        authenticatedWithSSOe={authenticatedWithSSOe}
      />
    );
  }

  return (
    <div className="health-care vads-u-margin-y--6">
      <h2 className="vads-u-margin-y--0">Health care</h2>

      <div className="vads-u-display--flex vads-u-flex-wrap--wrap">
        {/* Appointments */}
        <Appointments
          appointments={appointments}
          authenticatedWithSSOe={authenticatedWithSSOe}
        />
      </div>

      <div className="vads-u-margin-top--4">
        {/* Messages */}
        {canAccessMessaging && (
          <>
            <h3 className="vads-u-font-size--h4 vads-u-font-family--sans vads-u-margin-bottom--2p5">
              Messages
            </h3>
            <NotificationCTA CTA={viewMessagesCTA} />
          </>
        )}

        <h3>Manage your health care benefits</h3>
        <hr
          aria-hidden="true"
          className="vads-u-background-color--primary vads-u-margin-bottom--2 vads-u-margin-top--0p5 vads-u-border--0"
        />

        <a
          href={mhvUrl(
            authenticatedWithSSOe,
            'web/myhealthevet/refill-prescriptions',
          )}
          onClick={recordDashboardClick('manage-all-prescriptions')}
        >
          Manage all your prescriptions
        </a>

        <p>
          <a
            href={mhvUrl(isAuthenticatedWithSSOe, 'download-my-data')}
            rel="noreferrer noopener"
            target="_blank"
            className="vads-u-margin-bottom--2"
            // onClick={recordEvent()}
          >
            Get your lab and test results
          </a>
        </p>

        <p>
          <a
            href="/health-care/get-medical-records/"
            // onClick={recordDashboardClick('health-records')}
          >
            Get your VA medical records
          </a>
        </p>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const cernerAppointmentFacilities = selectCernerAppointmentsFacilities(state);
  const cernerMessagingFacilities = selectCernerMessagingFacilities(state);
  const cernerPrescriptionFacilities = selectCernerRxFacilities(state);

  const appointmentFacilityNames =
    cernerAppointmentFacilities?.map(facility =>
      getMedicalCenterNameByID(facility.facilityId),
    ) || [];
  const messagingFacilityNames =
    cernerMessagingFacilities?.map(facility =>
      getMedicalCenterNameByID(facility.facilityId),
    ) || [];
  const prescriptionFacilityNames =
    cernerPrescriptionFacilities?.map(facility =>
      getMedicalCenterNameByID(facility.facilityId),
    ) || [];

  const facilityNames = [
    ...new Set([
      ...appointmentFacilityNames,
      ...messagingFacilityNames,
      ...prescriptionFacilityNames,
    ]),
  ];

  return {
    appointments: state.health?.appointments?.data,
    isCernerPatient: selectIsCernerPatient(state),
    facilityNames,
    authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
    canAccessMessaging: state.user.profile?.services?.includes(
      backendServices.MESSAGING,
    ),
    unreadMessagesCount: selectUnreadMessagesCount(state),
  };
};

const mapDispatchToProps = {
  fetchInbox: fetchInboxAction,
  fetchConfirmedFutureAppointments: fetchConfirmedFutureAppointmentsAction,
};

HealthCare.propTypes = {
  authenticatedWithSSOe: PropTypes.bool.isRequired,
  isCernerPatient: PropTypes.bool,
  facilityNames: PropTypes.array.isRequired,
  canAccessRx: PropTypes.bool.isRequired,
  unreadMessagesCount: PropTypes.number,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HealthCare);
