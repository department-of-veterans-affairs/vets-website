import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { unreadCountInbox } from '../../util/helpers';
import { Paths } from '../../util/constants';

const DashboardUnreadMessages = props => {
  const { folders } = props;
  const [unreadCount, setUnreadCount] = useState(null);

  useEffect(
    () => {
      if (folders?.length > 0) {
        setUnreadCount(unreadCountInbox(folders));
      }
    },
    [folders],
  );
  return (
    <div className="unread-messages" data-testid="total-unread-messages">
      {folders === undefined && (
        <h2 className="vads-u-font-size--h3">
          Unable to retrieve messages at this moment
        </h2>
      )}

      {folders !== undefined &&
        unreadCount > 0 && (
          <h2 className="vads-u-font-size--h3">{`${unreadCount} unread messages in your inbox`}</h2>
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
  folders: PropTypes.arrayOf(PropTypes.object),
};

export default DashboardUnreadMessages;
