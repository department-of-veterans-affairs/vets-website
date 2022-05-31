import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../../sass/user-profile.scss';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import DebtNotification from './DebtNotification';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import { fetchNotifications } from '../../actions/notifications';
import environment from '~/platform/utilities/environment';

const debtTemplateId = environment.isProduction()
  ? '7efc2b8b-e59a-4571-a2ff-0fd70253e973'
  : 'f9947b27-df3b-4b09-875c-7f76594d766d';

export const Notifications = ({
  getNotifications,
  notifications,
  notificationsError,
  dismissalError,
}) => {
  useEffect(
    () => {
      getNotifications();
    },
    [getNotifications],
  );
  const debtNotifications = notifications.filter(
    n => n.attributes.templateId === debtTemplateId,
  );

  if (
    (!debtNotifications || !debtNotifications.length) &&
    !notificationsError
  ) {
    return null;
  }

  return (
    <div data-testid="dashboard-notifications">
      <h2>Notifications</h2>
      {(notificationsError || dismissalError) && (
        <DashboardWidgetWrapper>
          <div
            data-testid="dashboard-notifications-error"
            className="vads-u-display--flex vads-u-flex-direction--column large-screen:vads-u-flex--1 vads-u-margin-bottom--2p5"
          >
            <VaAlert status="error" show-icon className="vads-u-margin-top--0">
              {notificationsError
                ? `We’re sorry. Something went wrong on our end, and we can’t access
                your debt information. Please try again later or go to the debts
                tool.`
                : `We’re sorry. Something went wrong on our end, and we can’t dismiss this notification. Please try again later.`}
            </VaAlert>
          </div>
        </DashboardWidgetWrapper>
      )}
      {!notificationsError &&
        debtNotifications.map((n, i) => (
          <DebtNotification
            key={i}
            hasError={notificationsError}
            notification={n}
          />
        ))}
    </div>
  );
};

Notifications.propTypes = {
  getNotifications: PropTypes.func.isRequired,
  dismissalError: PropTypes.bool,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        createdAt: PropTypes.string.isRequired,
        dismissed: PropTypes.bool.isRequired,
        templateId: PropTypes.string.isRequired,
        updatedAt: PropTypes.string,
        vaProfileId: PropTypes.string.isRequired,
      }),
    }),
  ),
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Notifications);
