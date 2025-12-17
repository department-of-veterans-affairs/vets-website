import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Paths, ErrorMessages } from '../../util/constants';
import HorizontalRule from '../shared/HorizontalRule';
import RouterLinkAction from '../shared/RouterLinkAction';

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
        <RouterLinkAction
          data-testid="inbox-link"
          href={Paths.INBOX}
          text="Go to your inbox"
        />

        {!noAssociations &&
          !allTriageGroupsBlocked && (
            <>
              <HorizontalRule />
              <RouterLinkAction
                data-testid="compose-message-link"
                href={Paths.COMPOSE}
                text="Start a new message"
              />
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
