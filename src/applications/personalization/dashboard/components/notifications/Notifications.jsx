import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import environment from '~/platform/utilities/environment';
import {
  useFeatureToggle,
  Toggler,
} from '~/platform/utilities/feature-toggles';
import { fetchNotifications } from '../../../common/actions/notifications';
import DebtNotificationAlert from './DebtNotificationAlert';
import TestNotification from './TestNotification';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';

const debtTemplateId = environment.isProduction()
  ? '7efc2b8b-e59a-4571-a2ff-0fd70253e973'
  : 'f9947b27-df3b-4b09-875c-7f76594d766d';

export const Notifications = ({
  getNotifications,
  notifications,
  notificationsError,
  dismissalError,
}) => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  // status will be 'warning' if toggle is on
  const status = useToggleValue(TOGGLE_NAMES.myVaUpdateErrorsWarnings)
    ? 'warning'
    : 'error';

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);
  const debtNotifications = notifications.filter(
    n => n.attributes.templateId === debtTemplateId,
  );

  if (!debtNotifications || !debtNotifications.length || notificationsError) {
    return null;
  }

  return (
    <div data-testid="dashboard-notifications">
      <h2>Notifications</h2>
      {dismissalError && (
        <DashboardWidgetWrapper>
          <div
            data-testid="dashboard-notifications-error"
            className="vads-u-display--flex vads-u-flex-direction--column desktop-lg:vads-u-flex--1 vads-u-margin-bottom--2p5"
          >
            <va-alert
              status={status}
              show-icon
              className="vads-u-margin-top--0"
            >
              <h2 slot="headline">Can’t dismiss notification</h2>
              <div>
                <p className="vads-u-margin-bottom--0">
                  We’re sorry. Something went wrong on our end, and we can’t
                  dismiss this notification. Please try again later.
                </p>
              </div>
            </va-alert>
          </div>
        </DashboardWidgetWrapper>
      )}
      {debtNotifications.map(n => (
        <Toggler
          toggleName={Toggler.TOGGLE_NAMES.myVaEnableNotificationComponent}
          key={n.id}
        >
          <Toggler.Enabled>
            <TestNotification
              key={n.id}
              hasError={notificationsError}
              notification={n}
            />
          </Toggler.Enabled>

          <Toggler.Disabled>
            <DebtNotificationAlert
              key={n.id}
              hasError={notificationsError}
              notification={n}
            />
          </Toggler.Disabled>
        </Toggler>
      ))}
    </div>
  );
};

Notifications.propTypes = {
  getNotifications: PropTypes.func.isRequired,
  dismissalError: PropTypes.bool,
  notifications: PropTypes.array,
  notificationsError: PropTypes.bool,
};

const mapStateToProps = state => {
  return {
    notifications: state.notifications.notifications,
    dismissalError: state.notifications.dismissalError,
    notificationsError: state.notifications.notificationError,
  };
};

const mapDispatchToProps = {
  getNotifications: fetchNotifications,
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
