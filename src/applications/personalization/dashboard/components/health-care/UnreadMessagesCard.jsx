import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { selectUnreadCount } from '~/applications/personalization/dashboard/selectors';

const getUnreadMessagesText = count => {
  if (count === 0) {
    return 'No unread messages';
  }
  return `${count} unread message${count === 1 ? '' : 's'}`;
};

const UnreadMessagesCard = ({
  // hasUnreadMessagesCountError,
  unreadMessagesCount,
}) => {
  return (
    <va-card>
      <h4 className="vads-u-margin-y--0 vads-u-padding-bottom--1">
        {getUnreadMessagesText(unreadMessagesCount)}
      </h4>
      <p className="vads-u-margin-y--0 vads-u-margin-top--0p5 vads-u-padding-y--1">
        <va-link
          active
          text="Go to inbox"
          href="/my-health/secure-messages/inbox"
        />
      </p>
    </va-card>
  );
};

UnreadMessagesCard.propTypes = {
  hasUnreadMessagesCountError: PropTypes.bool,
  unreadMessagesCount: PropTypes.number,
};

const mapStateToProps = state => {
  const unreadCountData = selectUnreadCount(state);

  return {
    // hasUnreadMessagesCountError: unreadCountData?.errors?.length > 0,
    unreadMessagesCount: unreadCountData?.count || 0,
  };
};

export default connect(mapStateToProps)(UnreadMessagesCard);
