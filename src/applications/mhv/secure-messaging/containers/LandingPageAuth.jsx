/*
The main application container. Responsibilities:
- Gating the application behind a login prompt (<RequiredLoginView />)
- Rendering various application states based on api call status

Assumptions that may need to be addressed:
- Assumes the only service required is MHV_AC
- Currently doesn't include a DowntimeNotification, but may want to given its external dependencies.
- Assumes the api call invoked by props.getAllMessages returns ALL messages. If pagination is handled by the server,
then additional functionality will need to be added to account for this.
*/

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import backendServices from 'platform/user/profile/constants/backendServices';
// import RequiredLoginView from 'platform/user/authorization/components/RequiredLoginView';
import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { getAllMessages } from '../actions';
import { getTriageTeams } from '../actions/triageTeams';
import { getFolders } from '../actions/folders';
import { getCategories } from '../actions/categories';
import { getMessages } from '../actions/messages';
import { DefaultFolders as Folder } from '../util/constants';
import EmergencyNote from '../components/EmergencyNote';
import InboxListView from '../components/MessageList/InboxListView';
import useInterval from '../hooks/use-interval';

const LandingPageAuth = () => {
  const dispatch = useDispatch();
  const error = null;
  const messages = useSelector(state => state.sm.messages?.messageList);

  // fire api call to retreive messages
  useEffect(() => {
    dispatch(getAllMessages());
    dispatch(getTriageTeams());
    dispatch(getFolders());
    dispatch(getCategories());
    // dispatch(getMessages(522243));
    dispatch(getMessages(Folder.INBOX)); // landing page retrieves only Inbox messages. Separate layout is used for other folders
    // dispatch(retrieveMessage(522265));
    // dispatch(retrieveMessage(7178447));
    // dispatch(retrieveFolder(0));
  }, []);

  useInterval(() => {
    dispatch(getAllMessages());
  }, 5000);

  let content;
  if (messages === undefined) {
    content = (
      <va-loading-indicator
        message="Loading your secure messages..."
        setFocus
      />
    );
  } else if (messages.length === 0) {
    // this is a temporary content. There is a separate story to handle empty folder messaging
    content = (
      <va-alert status="error" visible>
        <h2 slot="headline">No messages</h2>
        <p>There are no messages in this folder</p>
      </va-alert>
    );
  } else if (error) {
    content = (
      <va-alert status="error" visible>
        <h2 slot="headline">We’re sorry. Something went wrong on our end</h2>
        <p>
          You can’t view your secure messages because something went wrong on
          our end. Please check back soon.
        </p>
      </va-alert>
    );
  } else {
    content = (
      <>
        <InboxListView messages={messages} />
      </>
    );
  }

  return (
    <div className="vads-l-grid-container">
      <div className="main-content">
        <h1>Messages</h1>
        <p className="va-introtext vads-u-margin-top--0">
          When you send a message to your care team, it can take up to 3
          business days to get a response.
        </p>
        <EmergencyNote />
        <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
          <a
            className="vads-c-action-link--blue compose-message-link"
            href="/my-health/secure-messages/compose"
          >
            Compose message
          </a>
        </p>
        <div className="search-messages-input">
          <label
            className="vads-u-margin-top--2p5"
            htmlFor="search-message-folder-input"
          >
            Search the Messages folder
          </label>
          <VaSearchInput label="search-message-folder-input" />
        </div>

        <div>{content}</div>
      </div>
    </div>
  );
};

export default LandingPageAuth;
