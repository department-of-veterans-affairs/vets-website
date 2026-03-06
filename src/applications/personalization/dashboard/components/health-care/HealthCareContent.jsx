import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { selectIsCernerPatient } from '~/platform/user/cerner-dsot/selectors';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { selectUnreadCount } from '~/applications/personalization/dashboard/selectors';

import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import AppointmentCard from './AppointmentCard';

const HealthCareContent = ({
  appointments,
  unreadMessagesCount,
  shouldShowLoadingIndicator,
  hasInboxError,
  hasAppointmentsError,
  hasHealthEnrollmentError,
  isVAPatient,
  isLOA1,
  isCernerPatient,
}) => {
  const upcomingAppointments = appointments?.slice(0, 2) || [];
  const hasUpcomingAppointment = upcomingAppointments.length > 0;

  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  const NoUpcomingAppointments = () => (
    <va-card data-testid="no-upcoming-appointments-card">
      <h4 className="vads-u-margin-top--0">Upcoming appointments</h4>
      <p>You don’t have any upcoming appointments.</p>
      <va-link
        text="Manage health appointments"
        href="/my-health/appointments"
        active
      />
    </va-card>
  );

  const NoUnreadMessages = () => (
    <va-card data-testid="no-unread-messages-card">
      <h4 className="vads-u-margin-top--0">No unread messages</h4>
      <va-link
        text="Go to inbox"
        href="/my-health/secure-messages/inbox"
        active
      />
    </va-card>
  );

  const UnreadMessages = () => (
    <va-card data-testid="upread-messages-card">
      <h4 className="vads-u-margin-top--0">
        {unreadMessagesCount} unread message
        {unreadMessagesCount !== 1 && 's'}
      </h4>
      <va-link
        text="Go to inbox"
        href="/my-health/secure-messages/inbox"
        active
      />
    </va-card>
  );

  const NoHealthcareText = () => (
    <div data-testid="no-health-care-notice">
      <p>We can’t find any VA health care on file for you.</p>
    </div>
  );

  const HealthcareError = () => {
    // status will be 'warning' if toggle is on
    const status = useToggleValue(TOGGLE_NAMES.myVaUpdateErrorsWarnings)
      ? 'warning'
      : 'error';

    return (
      <va-alert status={status} data-testid="healthcare-error">
        <p className="vads-u-margin-y--0" data-testid="healthcare-error-text">
          We can’t show your health care information right now. Refresh this
          page or try again later.
        </p>
      </va-alert>
    );
  };

  const AppointmentsError = () => (
    <va-alert status="warning" data-testid="appointments-error">
      <p className="vads-u-margin-y--0">
        We can’t show your appointments right now. Refresh this page or try
        again later.
      </p>
    </va-alert>
  );

  const MessagesError = () => (
    <va-alert status="warning" data-testid="messages-error">
      <p className="vads-u-margin-y--0">
        We can’t show your messages right now. Refresh this page or try again
        later.
      </p>
    </va-alert>
  );

  const ManageAllAppointmentsLink = () => (
    <va-link
      text="Manage all appointments"
      href="/my-health/appointments"
      data-testid="manage-all-appointments-link"
    />
  );

  const MyHealtheVetLink = () => (
    <va-link text="Go to My HealtheVet" href="/my-health" />
  );

  if (shouldShowLoadingIndicator) {
    return <va-loading-indicator message="Loading health care..." />;
  }

  if (hasHealthEnrollmentError) {
    return (
      <div className="vads-l-row">
        <DashboardWidgetWrapper>
          <HealthcareError />
          <p className="vads-u-margin-top--2 vads-u-margin-bottom--0">
            <MyHealtheVetLink />
          </p>
        </DashboardWidgetWrapper>
      </div>
    );
  }

  return (
    <>
      <div>
        {isVAPatient && <h3 className="vads-u-margin-top--0">Appointments</h3>}
        {hasAppointmentsError && (
          <DashboardWidgetWrapper>
            <AppointmentsError />
          </DashboardWidgetWrapper>
        )}
        {hasUpcomingAppointment &&
          !isLOA1 && (
            <div className="vads-l-row">
              {upcomingAppointments.map(appointment => (
                <DashboardWidgetWrapper key={appointment.id}>
                  <AppointmentCard appointment={appointment} />
                </DashboardWidgetWrapper>
              ))}
              <ManageAllAppointmentsLink />
            </div>
          )}
        {!isVAPatient &&
          !isLOA1 && (
            <DashboardWidgetWrapper>
              <NoHealthcareText />
            </DashboardWidgetWrapper>
          )}
        {isVAPatient &&
          !hasUpcomingAppointment &&
          !hasAppointmentsError &&
          !isLOA1 &&
          !isCernerPatient && (
            <DashboardWidgetWrapper>
              <NoUpcomingAppointments />
              <p className="vads-u-margin-top--2 vads-u-margin-bottom--0">
                <ManageAllAppointmentsLink />
              </p>
            </DashboardWidgetWrapper>
          )}
      </div>
      {isVAPatient && (
        <div className="vads-l-row">
          <DashboardWidgetWrapper>
            {isVAPatient && <h3>Messages</h3>}
            {hasInboxError && <MessagesError />}
            {!hasInboxError &&
              unreadMessagesCount === 0 && <NoUnreadMessages />}
            {!hasInboxError && unreadMessagesCount > 0 && <UnreadMessages />}
          </DashboardWidgetWrapper>
        </div>
      )}
      <p className="vads-u-margin-top--2 vads-u-margin-bottom--0">
        <MyHealtheVetLink />
      </p>
    </>
  );
};

const mapStateToProps = state => {
  const fetchingAppointments = state.health?.appointments?.fetching;

  const hasUnreadMessagesCountError =
    selectUnreadCount(state)?.errors?.length > 0;
  const hasAppointmentsError = state.health?.appointments?.errors?.length > 0;
  const hasHealthEnrollmentError = !!state.hcaEnrollmentStatus?.hasServerError;

  return {
    appointments: state.health?.appointments?.data,
    hasInboxError: hasUnreadMessagesCountError,
    hasAppointmentsError,
    hasHealthEnrollmentError,
    isCernerPatient: selectIsCernerPatient(state),
    // TODO: We might want to rewrite this component so that we default to
    // showing the loading indicator until all required API calls have either
    // resolved or failed. Right now we only set this flag to true _after_ an
    // API call has started. This means that on first render, before `useEffect`
    // hooks fire, the component is going to be showing the UI with all of the
    // IconCTALinks before the supporting data has been loaded. It only switches
    // to showing the loading indicator _after_ the useEffect hooks have run and
    // API requests have started.
    shouldShowLoadingIndicator: fetchingAppointments,
    unreadMessagesCount: selectUnreadCount(state)?.count || 0,
  };
};

const mapDispatchToProps = {};

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
  fetchUnreadMessages: PropTypes.func,
  hasAppointmentsError: PropTypes.bool,
  hasHealthEnrollmentError: PropTypes.bool,
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
