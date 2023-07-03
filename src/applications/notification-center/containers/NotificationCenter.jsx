import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import environment from '~/platform/utilities/environment';
// import { Toggler } from '~/platform/utilities/feature-toggles/Toggler';
import DebtNotification from '../components/DebtNotification';
import { fetchNotifications } from '../actions/notifications';

const debtTemplateId = environment.isProduction()
  ? '7efc2b8b-e59a-4571-a2ff-0fd70253e973'
  : 'f9947b27-df3b-4b09-875c-7f76594d766d';

export const NotificationCenter = ({
  getNotifications,
  notifications,
  notificationsError,
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

  if (!debtNotifications || !debtNotifications.length || notificationsError) {
    return null;
  }

  return (
    <div data-testid="notification-center">
      <h1>Notification Center</h1>
      {debtNotifications.map(n => (
        <DebtNotification
          key={n.id}
          hasError={notificationsError}
          notification={n}
        />
      ))}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationCenter);
