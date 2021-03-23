import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import backendServices from '~/platform/user/profile/constants/backendServices';
import { GeneralCernerWidget } from '~/applications/personalization/dashboard/components/cerner-widgets';
import { fetchFolder as fetchInboxAction } from '~/applications/personalization/dashboard/actions/messaging';
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
  selectAvailableServices,
} from '~/platform/user/selectors';

import { mhvUrl } from '~/platform/site-wide/mhv/utilities';

import Appointments from './Appointments';
import IconCTALink from '../IconCTALink';

const HealthCare = ({
  appointments,
  authenticatedWithSSOe,
  shouldFetchMessages,
  fetchConfirmedFutureAppointments,
  isCernerPatient,
  facilityNames,
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
      if (shouldFetchMessages && !dataLoadingDisabled) {
        fetchInbox(FOLDER.inbox);
      }
    },
    [shouldFetchMessages, fetchInbox, dataLoadingDisabled],
  );

  if (isCernerPatient && facilityNames?.length) {
    return (
      <GeneralCernerWidget
        facilityNames={facilityNames}
        authenticatedWithSSOe={authenticatedWithSSOe}
      />
    );
  }

  const messagesText =
    typeof unreadMessagesCount === 'number'
      ? `You have ${unreadMessagesCount} new message${
          unreadMessagesCount === 1 ? '' : 's'
        }`
      : 'Send a secure message to your health care team';

  return (
    <div className="health-care vads-u-margin-y--6">
      <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
        Health care
      </h2>

      <div className="vads-u-display--flex vads-u-flex-wrap--wrap">
        {/* Appointments */}
        <Appointments appointments={appointments} />

        <div className="vads-u-display--flex vads-u-flex-direction--column cta-links vads-u-flex--1">
          {/* Messages */}
          <IconCTALink
            boldText={unreadMessagesCount > 0}
            href={mhvUrl(authenticatedWithSSOe, 'secure-messaging')}
            icon="comments"
            newTab
            text={messagesText}
          />

          {/* Prescriptions */}
          <IconCTALink
            href={mhvUrl(
              authenticatedWithSSOe,
              'web/myhealthevet/refill-prescriptions',
            )}
            icon="prescription-bottle"
            newTab
            text="Refill and track your prescriptions"
          />

          {/* Lab and test results */}
          <IconCTALink
            href={mhvUrl(authenticatedWithSSOe, 'download-my-data')}
            icon="clipboard-list"
            newTab
            text="Get your lab and test results"
          />

          {/* VA Medical records */}
          <IconCTALink
            href="/health-care/get-medical-records/"
            icon="file-medical"
            text="Get your VA medical records"
          />
        </div>
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
    shouldFetchMessages: selectAvailableServices(state).includes(
      backendServices.MESSAGING,
    ),
    isCernerPatient: selectIsCernerPatient(state),
    facilityNames,
    authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
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
