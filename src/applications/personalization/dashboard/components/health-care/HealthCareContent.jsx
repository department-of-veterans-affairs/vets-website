import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { differenceInDays } from 'date-fns';

import recordEvent from '~/platform/monitoring/record-event';
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

import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import HealthCareCTA from './HealthCareCTA';

import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import Appointments from './Appointments';
import CTALink from '../CTALink';

const HealthCareContent = ({
  appointments,
  authenticatedWithSSOe,
  shouldFetchUnreadMessages,
  fetchConfirmedFutureAppointmentsV2,
  fetchUnreadMessages,
  unreadMessagesCount,
  // TODO: possibly remove this prop in favor of mocking the API in our unit tests
  dataLoadingDisabled = false,
  shouldShowLoadingIndicator,
  shouldShowPrescriptions,
  hasInboxError,
  hasAppointmentsError,
  facilityNames,
}) => {
  const nextAppointment = appointments?.[0];
  const start = new Date(nextAppointment?.startsAt);
  const today = new Date();
  const hasUpcomingAppointment = differenceInDays(start, today) < 30;

  useEffect(
    () => {
      if (!dataLoadingDisabled) {
        fetchConfirmedFutureAppointmentsV2();
      }
    },
    [dataLoadingDisabled, fetchConfirmedFutureAppointmentsV2],
  );

  useEffect(
    () => {
      if (shouldFetchUnreadMessages && !dataLoadingDisabled) {
        fetchUnreadMessages();
      }
    },
    [shouldFetchUnreadMessages, fetchUnreadMessages, dataLoadingDisabled],
  );

  const shouldShowUnreadMessageAlert =
    shouldFetchUnreadMessages && !hasInboxError && unreadMessagesCount > 0;

  const shouldShowOnOneColumn =
    !shouldShowUnreadMessageAlert &&
    !hasUpcomingAppointment &&
    !hasAppointmentsError;

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
        {/* Messages */}
        {shouldShowUnreadMessageAlert ? (
          <div
            className="vads-u-display--flex vads-u-flex-direction--column large-screen:vads-u-flex--1 vads-u-margin-bottom--2p5"
            data-testid="unread-messages-alert"
          >
            <va-alert status="warning" show-icon>
              <div className="vads-u-margin-top--0">
                {`You have ${unreadMessagesCount} unread message${
                  unreadMessagesCount === 1 ? '' : 's'
                }. `}
                <CTALink
                  text="View your messages"
                  href={mhvUrl(authenticatedWithSSOe, 'secure-messaging')}
                  onClick={() =>
                    recordEvent({
                      event: 'nav-linkslist',
                      'links-list-header': 'View your messages',
                      'links-list-section-header': 'Health care',
                    })
                  }
                />
              </div>
            </va-alert>
          </div>
        ) : null}
        {(hasUpcomingAppointment || hasAppointmentsError) && (
          /* Appointments */
          <Appointments
            appointments={appointments}
            hasError={hasAppointmentsError}
          />
        )}
        {!hasUpcomingAppointment &&
          !hasAppointmentsError && (
            <p data-testid="no-appointment-message">
              You have no appointments scheduled in the next 30 days.
            </p>
          )}
        {shouldShowOnOneColumn ? (
          <HealthCareCTA
            hasAppointmentsError={hasAppointmentsError}
            hasInboxError={hasInboxError}
            authenticatedWithSSOe={authenticatedWithSSOe}
            hasUpcomingAppointment={hasUpcomingAppointment}
            shouldShowPrescriptions={shouldShowPrescriptions}
            unreadMessagesCount={unreadMessagesCount}
          />
        ) : null}
      </DashboardWidgetWrapper>
      {!shouldShowOnOneColumn ? (
        <DashboardWidgetWrapper>
          <HealthCareCTA
            hasAppointmentsError={hasAppointmentsError}
            hasInboxError={hasInboxError}
            authenticatedWithSSOe={authenticatedWithSSOe}
            hasUpcomingAppointment={hasUpcomingAppointment}
            shouldShowPrescriptions={shouldShowPrescriptions}
            unreadMessagesCount={unreadMessagesCount}
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
    facilityNames: selectUserCernerFacilityNames(state),
  };
};

const mapDispatchToProps = {
  fetchUnreadMessages: fetchUnreadMessageCountAction,
  fetchConfirmedFutureAppointmentsV2: fetchConfirmedFutureAppointmentsV2Action,
};

HealthCareContent.propTypes = {
  authenticatedWithSSOe: PropTypes.bool.isRequired,
  canAccessRx: PropTypes.bool.isRequired,
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
  facilityNames: PropTypes.arrayOf(PropTypes.string),
  fetchConfirmedFutureAppointmentsV2: PropTypes.func,
  fetchUnreadMessages: PropTypes.bool,
  hasAppointmentsError: PropTypes.bool,
  hasInboxError: PropTypes.bool,
  shouldFetchUnreadMessages: PropTypes.bool,
  // TODO: possibly remove this prop in favor of mocking the API in our unit tests
  shouldShowLoadingIndicator: PropTypes.bool,
  shouldShowPrescriptions: PropTypes.bool,
  unreadMessagesCount: PropTypes.number,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HealthCareContent);
