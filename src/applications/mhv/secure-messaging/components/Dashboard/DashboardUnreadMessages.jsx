import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Paths, ErrorMessages } from '../../util/constants';
import HorizontalRule from '../shared/HorizontalRule';

const DashboardUnreadMessages = props => {
  const { inbox } = props;

  const { noAssociations, allTriageGroupsBlocked } = useSelector(
    state => state.sm.recipients,
  );

  const unreadCountHeader = useMemo(
    () => {
      return (
        inbox !== undefined && (
          <h2
            data-dd-privacy="mask"
            data-testid="unread-messages"
            className="vads-u-font-size--h3"
            slot="headline"
          >
            {inbox === null
              ? ErrorMessages.LandingPage.GET_INBOX_ERROR
              : `${inbox.unreadCount} unread message${
                  inbox.unreadCount === 0 || inbox.unreadCount > 1 ? 's' : ''
                } in your inbox`}
          </h2>
        )
      );
    },
    [inbox],
  );

  return (
    <va-alert status="info" visible>
      {unreadCountHeader}
      <div className="vads-u-margin-top--1p5">
        <Link
          className="vads-c-action-link--blue vads-u-margin-top--1"
          data-testid="inbox-link"
          text="Go to your inbox"
          to={Paths.INBOX}
        >
          Go to your inbox
        </Link>

        {!noAssociations &&
          !allTriageGroupsBlocked && (
            <>
              <HorizontalRule />
              <Link
                data-testid="compose-message-link"
                className="vads-c-action-link--blue"
                to={Paths.COMPOSE}
              >
                Start a new message
              </Link>
            </>
          )}
      </div>
    </va-alert>
  );
};

DashboardUnreadMessages.propTypes = {
  inbox: PropTypes.object,
};

export default DashboardUnreadMessages;
