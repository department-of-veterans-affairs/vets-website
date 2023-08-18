import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Paths, ErrorMessages } from '../../util/constants';

const DashboardUnreadMessages = props => {
  const { inbox } = props;
  return (
    <div className="unread-messages" data-testid="total-unread-messages">
      {inbox === null && (
        <h2 className="vads-u-font-size--h3">
          {ErrorMessages.LandingPage.GET_INBOX_ERROR}
        </h2>
      )}

      {inbox !== undefined &&
        inbox?.unreadCount > 0 && (
          <h2 data-dd-privacy="mask" className="vads-u-font-size--h3">
            {`${inbox.unreadCount} unread messages in your inbox`}
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
  inbox: PropTypes.object,
};

export default DashboardUnreadMessages;
