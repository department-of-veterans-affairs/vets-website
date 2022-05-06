import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../../sass/user-profile.scss';
import DebtNotification from './DebtNotification';
import { fetchNotifications } from '../../actions/notifications';

export const Notifications = ({
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
  const debtsCount = notifications.filter(n => n.type === 'debts');
  return (
    <div data-testid="dashboard-notifications">
      <h2>Notifications</h2>
      <DebtNotification debtsCount={debtsCount} hasError={notificationsError} />
    </div>
  );
};

Notifications.propTypes = {
  getNotifications: PropTypes.func.isRequired,
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

const mapDispatchToProps = {
  getNotifications: fetchNotifications,
};

export default connect(
  {},
  mapDispatchToProps,
)(Notifications);
