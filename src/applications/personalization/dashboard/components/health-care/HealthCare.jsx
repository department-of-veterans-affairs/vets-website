import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { differenceInDays } from 'date-fns';
import LoadingIndicator from '@department-of-veterans-affairs/component-library/LoadingIndicator';
import recordEvent from '~/platform/monitoring/record-event';
import backendServices from '~/platform/user/profile/constants/backendServices';
import { CernerWidget } from '~/applications/personalization/dashboard/components/cerner-widgets';
import { fetchUnreadMessagesCount as fetchUnreadMessageCountAction } from '~/applications/personalization/dashboard/actions/messaging';
import { selectUnreadCount } from '~/applications/personalization/dashboard/selectors';
import { fetchConfirmedFutureAppointments as fetchConfirmedFutureAppointmentsAction } from '~/applications/personalization/appointments/actions';
import { isAuthenticatedWithSSOe } from '~/platform/user/authentication/selectors';

import {
  selectIsCernerPatient,
  selectAvailableServices,
} from '~/platform/user/selectors';

import { mhvUrl } from '~/platform/site-wide/mhv/utilities';

import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import Appointments from './Appointments';
import IconCTALink from '../IconCTALink';
import CTALink from '../CTALink';

const HealthCare = ({
  appointments,
  authenticatedWithSSOe,
  shouldFetchUnreadMessages,
  fetchConfirmedFutureAppointments,
  isCernerPatient,
  facilityLocations,
  fetchUnreadMessages,
  unreadMessagesCount,
  // TODO: possibly remove this prop in favor of mocking the API in our unit tests
  dataLoadingDisabled = false,
  shouldShowLoadingIndicator,
  shouldShowPrescriptions,
  hasInboxError,
  hasAppointmentsError,
}) => {
  const nextAppointment = appointments?.[0];
  const start = new Date(nextAppointment?.startsAt);
  const today = new Date();
  const hasUpcomingAppointment = differenceInDays(start, today) < 30;

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
      if (shouldFetchUnreadMessages && !dataLoadingDisabled) {
        fetchUnreadMessages();
      }
    },
    [shouldFetchUnreadMessages, fetchUnreadMessages, dataLoadingDisabled],
  );

  if (shouldShowLoadingIndicator) {
    return (
      <div className="health-care vads-u-margin-y--6">
        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          Health care
        </h2>
        <LoadingIndicator message="Loading health care..." />
      </div>
    );
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
    <div
      className="health-care-wrapper vads-u-margin-y--6"
      data-testid="dashboard-section-health-care"
    >
      <h2>Health care</h2>

      <div className="vads-l-row">
        <DashboardWidgetWrapper>
          {/* Messages */}
          {shouldFetchUnreadMessages &&
          !hasInboxError &&
          unreadMessagesCount > 0 ? (
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
                    newTab
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
        </DashboardWidgetWrapper>
        <DashboardWidgetWrapper>
          <h3 className="sr-only">Popular actions for Health Care</h3>
          {hasInboxError ||
            (unreadMessagesCount === 0 && (
              <IconCTALink
                text="Send a secure message to your health care team"
                icon="comments"
                newTab
                href={mhvUrl(authenticatedWithSSOe, 'secure-messaging')}
                onClick={() =>
                  recordEvent({
                    event: 'nav-linkslist',
                    'links-list-header': 'View your messages',
                    'links-list-section-header': 'Health care',
                  })
                }
              />
            ))}
          {!hasUpcomingAppointment &&
            !hasAppointmentsError && (
              <IconCTALink
                href="/health-care/schedule-view-va-appointments/appointments"
                icon="calendar-check"
                newTab
                text="Schedule and manage your appointments"
                onClick={() => {
                  recordEvent({
                    event: 'nav-linkslist',
                    'links-list-header': 'Schedule and view your appointments',
                    'links-list-section-header': 'Health care',
                  });
                }}
              />
            )}

          {/* Prescriptions */}
          {shouldShowPrescriptions ? (
            <IconCTALink
              href={mhvUrl(
                authenticatedWithSSOe,
                'web/myhealthevet/refill-prescriptions',
              )}
              icon="prescription-bottle"
              newTab
              text="Refill and track your prescriptions"
              onClick={() => {
                recordEvent({
                  event: 'nav-linkslist',
                  'links-list-header': 'Refill and track your prescriptions',
                  'links-list-section-header': 'Health care',
                });
              }}
            />
          ) : null}

          {/* Request travel reimbursement */}
          <IconCTALink
            href="/health-care/get-reimbursed-for-travel-pay/"
            icon="suitcase"
            newTab
            text="Request travel reimbursement"
            onClick={() => {
              recordEvent({
                event: 'nav-linkslist',
                'links-list-header': 'Request travel reimbursement"',
                'links-list-section-header': 'Health care',
              });
            }}
          />

          {/* VA Medical records */}
          <IconCTALink
            href={mhvUrl(authenticatedWithSSOe, 'download-my-data')}
            icon="file-medical"
            newTab
            text="Get your VA medical records"
            onClick={() => {
              recordEvent({
                event: 'nav-linkslist',
                'links-list-header': 'Get your VA medical records',
                'links-list-section-header': 'Health care',
              });
            }}
          />
        </DashboardWidgetWrapper>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const facilityLocations = [
    'VA Spokane health care',
    'VA Walla Walla health care',
    'VA Central Ohio health care',
  ];

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
  isCernerPatient: PropTypes.bool,
  facilityLocations: PropTypes.array.isRequired,
  canAccessRx: PropTypes.bool.isRequired,
  unreadMessagesCount: PropTypes.number,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HealthCare);
