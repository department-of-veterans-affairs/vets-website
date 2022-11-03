import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import backendServices from '~/platform/user/profile/constants/backendServices';
import { CernerWidget } from '~/applications/personalization/dashboard/components/cerner-widgets';
import { fetchUnreadMessagesCount as fetchUnreadMessageCountAction } from '~/applications/personalization/dashboard/actions/messaging';
import {
  selectUnreadCount,
  selectUseVaosV2APi,
} from '~/applications/personalization/dashboard/selectors';
import {
  fetchConfirmedFutureAppointments as fetchConfirmedFutureAppointmentsAction,
  fetchConfirmedFutureAppointmentsV2 as fetchConfirmedFutureAppointmentsV2Action,
} from '~/applications/personalization/appointments/actions';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

import {
  selectIsCernerPatient,
  selectAvailableServices,
} from '~/platform/user/selectors';

import { mhvUrl } from '~/platform/site-wide/mhv/utilities';
import HealthCareCTA from './HealthCareCTAV2';

import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import Appointments from './AppointmentsV2';
import CTALink from '../CTALink';

const HealthCareContentV2 = ({
  appointments,
  authenticatedWithSSOe,
  shouldFetchUnreadMessages,
  fetchConfirmedFutureAppointments,
  fetchConfirmedFutureAppointmentsV2,
  isCernerPatient,
  facilityLocations,
  fetchUnreadMessages,
  unreadMessagesCount,
  // TODO: possibly remove this prop in favor of mocking the API in our unit tests
  dataLoadingDisabled = false,
  shouldShowLoadingIndicator,
  hasInboxError,
  hasAppointmentsError,
  useVaosV2Api,
  isVAPatient,
}) => {
  const nextAppointment = appointments?.[0];
  const hasUpcomingAppointment = !!nextAppointment;

  useEffect(
    () => {
      if (!dataLoadingDisabled && isVAPatient) {
        if (useVaosV2Api) {
          fetchConfirmedFutureAppointmentsV2();
        } else {
          fetchConfirmedFutureAppointments();
        }
      }
    },
    [
      fetchConfirmedFutureAppointments,
      dataLoadingDisabled,
      useVaosV2Api,
      fetchConfirmedFutureAppointmentsV2,
      isVAPatient,
    ],
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

  const shouldShowUnreadMessageAlert =
    shouldFetchUnreadMessages && !hasInboxError && unreadMessagesCount > 0;

  const shouldShowOnOneColumn =
    !isVAPatient || (!shouldShowUnreadMessageAlert && !hasUpcomingAppointment);

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
    return (
      <div className="vads-u-margin-bottom--2p5">
        <va-alert
          status="error"
          show-icon
          data-testid="outstanding-debts-error-v2"
        >
          <h2 slot="headline">
            We can’t access your appointment information right now
          </h2>
          <div>
            We’re sorry. Something went wrong on our end and we can’t access
            your appointment information. Please try again later or go to the
            appointments tool
          </div>
          <CTALink
            text="Schedule and manage your appointments"
            href="/health-care/schedule-view-va-appointments/appointments"
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
  if (isCernerPatient && facilityLocations?.length) {
    return (
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8 medium-screen:vads-u-padding-right--3">
          <CernerWidget
            facilityLocations={facilityLocations}
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
            data-testid="unread-messages-alert-v2"
          >
            <va-alert status="warning" show-icon>
              <div className="vads-u-margin-top--0">
                {`You have ${unreadMessagesCount} unread message${
                  unreadMessagesCount === 1 ? '' : 's'
                }. `}
                <CTALink
                  text="Review your messages"
                  newTab
                  href={mhvUrl(authenticatedWithSSOe, 'secure-messaging')}
                  onClick={() =>
                    recordEvent({
                      event: 'nav-linkslist',
                      'links-list-header': 'Review your messages',
                      'links-list-section-header': 'Health care',
                    })
                  }
                />
              </div>
            </va-alert>
          </div>
        ) : null}
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
      {!shouldShowOnOneColumn && !hasAppointmentsError ? (
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
  const facilityLocations = [
    'VA Spokane health care',
    'VA Walla Walla health care',
    'VA Central Ohio health care',
    'Roseburg (Oregon) VA health care',
    'White City health care',
  ];

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
    facilityLocations,
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
    unreadMessagesCount: selectUnreadCount(state).count || 0,
    useVaosV2Api: selectUseVaosV2APi(state),
  };
};

const mapDispatchToProps = {
  fetchUnreadMessages: fetchUnreadMessageCountAction,
  fetchConfirmedFutureAppointments: fetchConfirmedFutureAppointmentsAction,
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
  canAccessRx: PropTypes.bool,
  dataLoadingDisabled: PropTypes.bool,
  facilityLocations: PropTypes.arrayOf(PropTypes.string),
  fetchConfirmedFutureAppointments: PropTypes.func,
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
  useVaosV2Api: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HealthCareContentV2);
