import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { unreadCountAllFolders } from '../../util/helpers';

const UnreadMessages = props => {
  return (
    <div className="unread-messages">
      {props.folders === null && (
        <h2>Unable to retrieve messages at this moment</h2>
      )}

      {props.folders && (
        <h2>
          {`You have ${unreadCountAllFolders(props.folders)} unread messages`}
        </h2>
      )}

      <Link
        className="vads-c-action-link--blue vads-u-margin-top--1"
        text="View Inbox"
        to="/inbox"
      >
        View Inbox
      </Link>
    </div>
  );
};

UnreadMessages.propTypes = {
  folders: PropTypes.arrayOf(PropTypes.object),
};

export default UnreadMessages;
