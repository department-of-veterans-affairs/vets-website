import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { selectIsCernerPatient } from '~/platform/user/cerner-dsot/selectors';
import recordEvent from '~/platform/monitoring/record-event';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import backendServices from '~/platform/user/profile/constants/backendServices';
import { CernerWidget } from '~/applications/personalization/dashboard/components/cerner-widgets';
import { fetchUnreadMessagesCount as fetchUnreadMessageCountAction } from '~/applications/personalization/dashboard/actions/messaging';
import {
  selectUnreadCount,
  selectUserCernerFacilityNames,
} from '~/applications/personalization/dashboard/selectors';
import { fetchConfirmedFutureAppointmentsV2 as fetchConfirmedFutureAppointmentsV2Action } from '~/applications/personalization/appointments/actions';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

import { selectAvailableServices } from '~/platform/user/selectors';

import HealthCareCTA from './HealthCareCTAV2';

import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import Appointments from './AppointmentsV2';
import CTALink from '../CTALink';

const HealthCareContentV2 = ({
  appointments,
  authenticatedWithSSOe,
  shouldFetchUnreadMessages,
  fetchConfirmedFutureAppointmentsV2,
  facilityNames,
  fetchUnreadMessages,
  unreadMessagesCount,
  // TODO: possibly remove this prop in favor of mocking the API in our unit tests
  dataLoadingDisabled = false,
  shouldShowLoadingIndicator,
  hasInboxError,
  hasAppointmentsError,
  isVAPatient,
}) => {
  const nextAppointment = appointments?.[0];
  const hasUpcomingAppointment = !!nextAppointment;

  useEffect(
    () => {
      if (!dataLoadingDisabled && isVAPatient) {
        fetchConfirmedFutureAppointmentsV2();
      }
    },
    [dataLoadingDisabled, fetchConfirmedFutureAppointmentsV2, isVAPatient],
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

  const shouldShowOnOneColumn = !isVAPatient || !hasUpcomingAppointment;

  const NoUpcomingAppointmentsText = () => {
    return (
      <p
        className="vads-u-margin-bottom--2p5 vads-u-margin-top--0"
        data-testid="no-upcoming-appointments-text-v2"
      >
        You have no upcoming appointments to show.
      </p>
    );
  };

  const NoHealthcareText = () => {
    return (
      <p
        className="vads-u-margin-bottom--2p5 vads-u-margin-top--0"
        data-testid="no-healthcare-text-v2"
      >
        You have no health care information to show.
      </p>
    );
  };

  const HealthcareError = () => {
    const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

    // status will be 'warning' if toggle is on
    const status = useToggleValue(TOGGLE_NAMES.myVaUpdateErrorsWarnings)
      ? 'warning'
      : 'error';

    // appt link will be /my-health/appointments if toggle is on
    const apptLink = useToggleValue(
      TOGGLE_NAMES.vaOnlineSchedulingBreadcrumbUrlUpdate,
    )
      ? '/my-health/appointments'
      : '/health-care/schedule-view-va-appointments/appointments';

    return (
      <div className="vads-u-margin-bottom--2p5">
        <va-alert status={status} show-icon data-testid="healthcare-error-v2">
          <h2 slot="headline">We can’t access your appointment information</h2>
          <div>
            We’re sorry. Something went wrong on our end and we can’t access
            your appointment information. Please try again later or go to the
            appointments tool:
          </div>
          <CTALink
            text="Schedule and manage your appointments"
            href={apptLink}
            showArrow
            className="vads-u-font-weight--bold"
            onClick={() =>
              recordEvent({
                event: 'nav-linkslist',
                'links-list-header': 'Schedule and manage your appointments',
                'links-list-section-header': 'Health care',
              })
            }
            testId="view-manage-appointments-link-from-error"
          />
        </va-alert>
      </div>
    );
  };

  if (shouldShowLoadingIndicator) {
    return <va-loading-indicator message="Loading health care..." />;
  }
  if (facilityNames?.length > 0) {
    return (
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8 medium-screen:vads-u-padding-right--3">
          <CernerWidget
            facilityLocations={facilityNames}
            authenticatedWithSSOe={authenticatedWithSSOe}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="vads-l-row">
      <DashboardWidgetWrapper>
        {hasAppointmentsError && <HealthcareError />}
        {hasUpcomingAppointment && (
          /* Appointments */
          <Appointments appointments={appointments} />
        )}
        {!isVAPatient && <NoHealthcareText />}
        {isVAPatient &&
          !hasUpcomingAppointment &&
          !hasAppointmentsError && <NoUpcomingAppointmentsText />}
        {shouldShowOnOneColumn ? (
          <HealthCareCTA
            hasInboxError={hasInboxError}
            authenticatedWithSSOe={authenticatedWithSSOe}
            hasUpcomingAppointment={hasUpcomingAppointment}
            unreadMessagesCount={unreadMessagesCount}
            isVAPatient={isVAPatient}
            hasAppointmentsError={hasAppointmentsError}
          />
        ) : null}
      </DashboardWidgetWrapper>
      {!shouldShowOnOneColumn ? (
        <DashboardWidgetWrapper>
          <HealthCareCTA
            hasInboxError={hasInboxError}
            authenticatedWithSSOe={authenticatedWithSSOe}
            hasUpcomingAppointment={hasUpcomingAppointment}
            unreadMessagesCount={unreadMessagesCount}
            isVAPatient={isVAPatient}
            hasAppointmentsError={hasAppointmentsError}
          />
        </DashboardWidgetWrapper>
      ) : null}
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
    facilityNames: selectUserCernerFacilityNames(state),
  };
};

const mapDispatchToProps = {
  fetchUnreadMessages: fetchUnreadMessageCountAction,
  fetchConfirmedFutureAppointmentsV2: fetchConfirmedFutureAppointmentsV2Action,
};

HealthCareContentV2.propTypes = {
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
  authenticatedWithSSOe: PropTypes.bool,
  dataLoadingDisabled: PropTypes.bool,
  facilityNames: PropTypes.arrayOf(PropTypes.string),
  fetchConfirmedFutureAppointmentsV2: PropTypes.func,
  fetchUnreadMessages: PropTypes.func,
  hasAppointmentsError: PropTypes.bool,
  hasInboxError: PropTypes.bool,
  isCernerPatient: PropTypes.bool,
  isVAPatient: PropTypes.bool,
  shouldFetchUnreadMessages: PropTypes.bool,
  // TODO: possibly remove this prop in favor of mocking the API in our unit tests
  shouldShowLoadingIndicator: PropTypes.bool,
  unreadMessagesCount: PropTypes.number,
};

export const UnconnectedHealthCareContentV2 = HealthCareContentV2;

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HealthCareContentV2);
