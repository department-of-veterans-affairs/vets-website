import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
        <VaLinkAction
          data-testid="inbox-link"
          href={Paths.INBOX}
          text="Go to your inbox"
        />

        {!noAssociations &&
          !allTriageGroupsBlocked && (
            <>
              <HorizontalRule />
              <VaLinkAction
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
