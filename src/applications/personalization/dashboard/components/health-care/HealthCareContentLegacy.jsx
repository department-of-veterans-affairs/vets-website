import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { selectIsCernerPatient } from '~/platform/user/cerner-dsot/selectors';
import recordEvent from '~/platform/monitoring/record-event';
import {
  useFeatureToggle,
  Toggler,
} from '~/platform/utilities/feature-toggles';
import backendServices from '~/platform/user/profile/constants/backendServices';
import { fetchUnreadMessagesCount as fetchUnreadMessageCountAction } from '~/applications/personalization/dashboard/actions/messaging';
import { selectUnreadCount } from '~/applications/personalization/dashboard/selectors';
import { fetchConfirmedFutureAppointments as fetchConfirmedFutureAppointmentsAction } from '~/applications/personalization/appointments/actions';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

import { selectAvailableServices } from '~/platform/user/selectors';

import HealthCareCTA from './HealthCareCTA';

import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import AppointmentsCardLegacy from './AppointmentsCardLegacy';

const HealthCareContent = ({
  appointments,
  shouldFetchUnreadMessages,
  fetchConfirmedFutureAppointments,
  fetchUnreadMessages,
  unreadMessagesCount,
  // TODO: possibly remove this prop in favor of mocking the API in our unit tests
  dataLoadingDisabled = false,
  shouldShowLoadingIndicator,
  hasInboxError,
  hasAppointmentsError,
  isVAPatient,
  isLOA1,
  isCernerPatient,
}) => {
  const nextAppointment = appointments?.[0];
  const hasUpcomingAppointment = !!nextAppointment;

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
      if (shouldFetchUnreadMessages && !dataLoadingDisabled && isVAPatient) {
        fetchUnreadMessages();
      }
    },
    [
      shouldFetchUnreadMessages,
      fetchUnreadMessages,
      dataLoadingDisabled,
      isVAPatient,
    ],
  );

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const shouldShowOnOneColumn =
    !isVAPatient || !hasUpcomingAppointment || isLOA1;

  const NoUpcomingAppointmentsText = () => {
    return (
      <p
        className="vads-u-margin-bottom--2p5 vads-u-margin-top--0"
        data-testid="no-upcoming-appointments-text"
      >
        You have no upcoming appointments to show.
      </p>
    );
  };

  const NoHealthcareText = () => {
    return (
      <p
        className="vads-u-margin-bottom--2p5 vads-u-margin-top--0"
        data-testid="no-healthcare-text"
      >
        You have no health care information to show.
      </p>
    );
  };

  const HealthcareError = () => {
    // status will be 'warning' if toggle is on
    const status = useToggleValue(TOGGLE_NAMES.myVaUpdateErrorsWarnings)
      ? 'warning'
      : 'error';

    return (
      <div className="vads-u-margin-bottom--2p5">
        <va-alert status={status} show-icon data-testid="healthcare-error">
          <h2 slot="headline">We can’t access your appointment information</h2>
          <div>
            We’re sorry. Something went wrong on our end and we can’t access
            your appointment information. Please try again later or go to the
            appointments tool:
          </div>
          <va-link
            text="Schedule and manage your appointments"
            href="/my-health/appointments"
            active
            className="vads-u-font-weight--bold"
            onClick={() =>
              recordEvent({
                event: 'nav-linkslist',
                'links-list-header': 'Schedule and manage your appointments',
                'links-list-section-header': 'Health care',
              })
            }
            data-testid="view-manage-appointments-link-from-error"
          />
        </va-alert>
      </div>
    );
  };

  if (shouldShowLoadingIndicator) {
    return <va-loading-indicator message="Loading health care..." />;
  }

  return (
    <div className="vads-l-row">
      <DashboardWidgetWrapper>
        {hasAppointmentsError && <HealthcareError />}
        {hasUpcomingAppointment &&
          !isLOA1 && <AppointmentsCardLegacy appointments={appointments} />}
        {!isVAPatient && !isLOA1 && <NoHealthcareText />}
        {isVAPatient &&
          !hasUpcomingAppointment &&
          !hasAppointmentsError &&
          !isLOA1 &&
          !isCernerPatient && <NoUpcomingAppointmentsText />}
        {shouldShowOnOneColumn && (
          <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}>
            <Toggler.Disabled>
              <HealthCareCTA
                hasInboxError={hasInboxError}
                hasUpcomingAppointment={hasUpcomingAppointment}
                unreadMessagesCount={unreadMessagesCount}
                isVAPatient={isVAPatient}
                isLOA1={isLOA1}
                hasAppointmentsError={hasAppointmentsError}
              />
            </Toggler.Disabled>
          </Toggler>
        )}
      </DashboardWidgetWrapper>
      {!shouldShowOnOneColumn && (
        <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}>
          <Toggler.Disabled>
            <DashboardWidgetWrapper>
              <HealthCareCTA
                hasInboxError={hasInboxError}
                hasUpcomingAppointment={hasUpcomingAppointment}
                unreadMessagesCount={unreadMessagesCount}
                isVAPatient={isVAPatient}
                hasAppointmentsError={hasAppointmentsError}
              />
            </DashboardWidgetWrapper>
          </Toggler.Disabled>
        </Toggler>
      )}
    </div>
  );
};

const mapStateToProps = state => {
  const shouldFetchUnreadMessages = selectAvailableServices(state).includes(
    backendServices.MESSAGING,
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
    isCernerPatient: selectIsCernerPatient(state),
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
    unreadMessagesCount: selectUnreadCount(state)?.count || 0,
  };
};

const mapDispatchToProps = {
  fetchUnreadMessages: fetchUnreadMessageCountAction,
  fetchConfirmedFutureAppointments: fetchConfirmedFutureAppointmentsAction,
};

HealthCareContent.propTypes = {
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
  fetchConfirmedFutureAppointments: PropTypes.func,
  fetchUnreadMessages: PropTypes.func,
  hasAppointmentsError: PropTypes.bool,
  hasInboxError: PropTypes.bool,
  isCernerPatient: PropTypes.bool,
  isLOA1: PropTypes.bool,
  isVAPatient: PropTypes.bool,
  shouldFetchUnreadMessages: PropTypes.bool,
  // TODO: possibly remove this prop in favor of mocking the API in our unit tests
  shouldShowLoadingIndicator: PropTypes.bool,
  unreadMessagesCount: PropTypes.number,
};

export const UnconnectedHealthCareContent = HealthCareContent;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HealthCareContent);
