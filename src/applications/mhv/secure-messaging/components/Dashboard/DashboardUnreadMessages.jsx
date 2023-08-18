import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Paths } from '../../util/constants';

const DashboardUnreadMessages = props => {
  const { unreadCount } = props;
  return (
    <div className="unread-messages" data-testid="total-unread-messages">
      {unreadCount === null && (
        <h2 className="vads-u-font-size--h3">
          Unable to retrieve messages at this moment
        </h2>
      )}

      {unreadCount !== undefined &&
        unreadCount > 0 && (
          <h2 data-dd-privacy="mask" className="vads-u-font-size--h3">
            {`${unreadCount} unread messages in your inbox`}
          </h2>
        )}

      <Link
        className="vads-c-action-link--blue vads-u-margin-top--1"
        text="Go to your inbox"
        to={Paths.INBOX}
      >
        Go to your inbox
      </Link>
    </div>
  );
};

DashboardUnreadMessages.propTypes = {
  unreadCount: PropTypes.number,
};

export default DashboardUnreadMessages;
