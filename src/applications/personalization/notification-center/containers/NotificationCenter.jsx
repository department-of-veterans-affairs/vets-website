import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import environment from '~/platform/utilities/environment';
// import { Toggler } from '~/platform/utilities/feature-toggles/Toggler';
import DebtNotification from '../../common/components/DebtNotification';
import OtherNotification from '../../common/components/OtherNotification';
import { fetchNotifications } from '../../common/actions/notifications';

const debtTemplateId = environment.isProduction()
  ? '7efc2b8b-e59a-4571-a2ff-0fd70253e973'
  : 'f9947b27-df3b-4b09-875c-7f76594d766d';

export const NotificationCenter = ({
  getNotifications,
  notifications,
  notificationsError,
}) => {
  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  // empty state for no notifications, or error fetching
  if (!notifications.length || notificationsError) {
    return null;
  }

  return (
    <div data-testid="notification-center">
      <h1>Notification Center</h1>
      {/* can convert this into switch cases when we have at least 3 types */}
      {Object.keys(notifications).map(n =>
        notifications[n].attributes.templateId === debtTemplateId ? (
          <DebtNotification
            key={notifications[n].id}
            hasError={notificationsError}
            notification={notifications[n]}
          />
        ) : (
          <OtherNotification
            key={notifications[n].id}
            hasError={notificationsError}
            notification={notifications[n]}
          />
        ),
      )}
    </div>
  );
};

NotificationCenter.propTypes = {
  getNotifications: PropTypes.func.isRequired,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      attributes: PropTypes.shape({
        createdAt: PropTypes.string.isRequired,
        dismissed: PropTypes.bool,
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
    notificationsError: state.notifications.notificationError,
  };
};

const mapDispatchToProps = {
  getNotifications: fetchNotifications,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationCenter);
