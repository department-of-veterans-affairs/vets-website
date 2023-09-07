import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Paths, ErrorMessages } from '../../util/constants';

const DashboardUnreadMessages = props => {
  const { inbox } = props;
  const unreadCountHeader = useMemo(
    () => {
      return (
        <h2 data-dd-privacy="mask" className="vads-u-font-size--h3">
          {inbox === null && ErrorMessages.LandingPage.GET_INBOX_ERROR}
          {inbox?.unreadCount > 0 &&
            `${inbox.unreadCount} unread messages in your inbox`}
        </h2>
      );
    },
    [inbox],
  );

  return (
    <div className="unread-messages" data-testid="total-unread-messages">
      {unreadCountHeader}

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
