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
} from '~/platform/user/selectors';

import Appointments from './Appointments';
import IconCTALink from '../IconCTALink';

import {
  messagesCTA,
  prescriptionsCTA,
  labResultsCTA,
  medicalRecordsCTA,
} from '~/applications/personalization/dashboard-2/components/health-care/ctaHelper';

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
      <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
        Health care
      </h2>

      <div className="vads-u-display--flex vads-u-flex-wrap--wrap">
        {/* Appointments */}
        <Appointments
          appointments={appointments}
          authenticatedWithSSOe={authenticatedWithSSOe}
        />

        <div className="vads-u-display--flex vads-u-flex-direction--column cta-links vads-u-flex--1">
          {/* Messages */}
          <IconCTALink
            CTA={messagesCTA(authenticatedWithSSOe, unreadMessagesCount)}
          />

          {/* Prescriptions */}
          <IconCTALink CTA={prescriptionsCTA(authenticatedWithSSOe)} />

          {/* Lab and test results */}
          <IconCTALink CTA={labResultsCTA(authenticatedWithSSOe)} />

          {/* VA Medical records */}
          <IconCTALink CTA={medicalRecordsCTA} />
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
    isCernerPatient: selectIsCernerPatient(state),
    facilityNames,
    authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
    canAccessMessaging: true,
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
