import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import backendServices from '~/platform/user/profile/constants/backendServices';
import HealthCareContent from './HealthCareContent';
import { fetchUnreadMessagesCount as fetchUnreadMessageCountAction } from '~/applications/personalization/dashboard/actions/messaging';
import { selectUnreadCount } from '~/applications/personalization/dashboard/selectors';
import { fetchConfirmedFutureAppointments as fetchConfirmedFutureAppointmentsAction } from '~/applications/personalization/appointments/actions';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

import { selectAvailableServices } from '~/platform/user/selectors';

const HealthCare = ({
  shouldFetchUnreadMessages,
  fetchConfirmedFutureAppointments,
  fetchUnreadMessages,
  dataLoadingDisabled = false,
  shouldShowLoadingIndicator,
  isVAPatient,
  isLOA1,
}) => {
  useEffect(
    () => {
      if (!dataLoadingDisabled && isVAPatient) {
        fetchConfirmedFutureAppointments();
      }
    },
    [dataLoadingDisabled, fetchConfirmedFutureAppointments, isVAPatient],
  );

  useEffect(
    () => {
      if (shouldFetchUnreadMessages && !dataLoadingDisabled) {
        fetchUnreadMessages();
      }
    },
    [shouldFetchUnreadMessages, fetchUnreadMessages, dataLoadingDisabled],
  );

  const headerClassNames = shouldShowLoadingIndicator
    ? 'vads-u-margin-top--0 vads-u-margin-bottom--2'
    : '';

  return (
    <div
      className="health-care-wrapper vads-u-margin-y--6"
      data-testid="dashboard-section-health-care"
    >
      <h2 data-testid="health-care-section-header" className={headerClassNames}>
        Health care
      </h2>
      <HealthCareContent
        dataLoadingDisabled={dataLoadingDisabled}
        isVAPatient={isVAPatient}
        isLOA1={isLOA1}
      />
    </div>
  );
};

const mapStateToProps = state => {
  const shouldFetchUnreadMessages = selectAvailableServices(state).includes(
    backendServices.MESSAGING,
  );
  const shouldShowPrescriptions = selectAvailableServices(state).includes(
    backendServices.RX,
  );

  const fetchingAppointments = state.health?.appointments?.fetching;
  const fetchingUnreadMessages = shouldFetchUnreadMessages
    ? selectUnreadCount(state)?.fetching
    : false;

  const hasUnreadMessagesCountError =
    selectUnreadCount(state)?.errors?.length > 0;
  const hasAppointmentsError = state.health?.appointments?.errors?.length > 0;

  return {
    appointments: state.health?.appointments?.data,
    authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
    hasInboxError: hasUnreadMessagesCountError,
    hasAppointmentsError,
    shouldFetchUnreadMessages,
    // TODO: We might want to rewrite this component so that we default to
    // showing the loading indicator until all required API calls have either
    // resolved or failed. Right now we only set this flag to true _after_ an
    // API call has started. This means that on first render, before `useEffect`
    // hooks fire, the component is going to be showing the UI with all of the
    // IconCTALinks before the supporting data has been loaded. It only switches
    // to showing the loading indicator _after_ the useEffect hooks have run and
    // API requests have started.
    shouldShowLoadingIndicator: fetchingAppointments || fetchingUnreadMessages,
    shouldShowPrescriptions,
    unreadMessagesCount: selectUnreadCount(state).count || 0,
  };
};

const mapDispatchToProps = {
  fetchUnreadMessages: fetchUnreadMessageCountAction,
  fetchConfirmedFutureAppointments: fetchConfirmedFutureAppointmentsAction,
};

HealthCare.propTypes = {
  authenticatedWithSSOe: PropTypes.bool.isRequired,
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      additionalInfo: PropTypes.string,
      facility: PropTypes.object,
      id: PropTypes.string.isRequired,
      isVideo: PropTypes.bool.isRequired,
      providerName: PropTypes.string,
      startsAt: PropTypes.string.isRequired,
      timeZone: PropTypes.string,
      type: PropTypes.string.isRequired,
    }),
  ),
  dataLoadingDisabled: PropTypes.bool,
  facilityLocations: PropTypes.arrayOf(PropTypes.string),
  fetchConfirmedFutureAppointments: PropTypes.func,
  fetchUnreadMessages: PropTypes.func,
  hasAppointmentsError: PropTypes.bool,
  hasInboxError: PropTypes.bool,
  isLOA1: PropTypes.bool,
  isVAPatient: PropTypes.bool,
  shouldFetchUnreadMessages: PropTypes.bool,
  // TODO: possibly remove this prop in favor of mocking the API in our unit tests
  shouldShowLoadingIndicator: PropTypes.bool,
  shouldShowPrescriptions: PropTypes.bool,
  unreadMessagesCount: PropTypes.number,
};

export const UnconnectedHealthCare = HealthCare;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HealthCare);
