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
import Breadcrumbs from '../components/shared/Breadcrumbs';
import EmergencyNote from '../components/EmergencyNote';
import InboxListView from '../components/MessageList/InboxListView';
import Navigation from '../components/Navigation';

const LandingPageAuth = () => {
  const dispatch = useDispatch();
  // const user = useSelector(state => state?.user);
  const { isLoading, messages, error } = useSelector(
    state => state?.allMessages,
  );

  // fire api call to retreive messages
  useEffect(() => {
    dispatch(getAllMessages());
  }, []);

  let content;
  if (isLoading) {
    content = (
      <va-loading-indicator
        message="Loading your secure messages..."
        setFocus
      />
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
    // <RequiredLoginView
    //   user={props.user}
    //   serviceRequired={backendServices.MHV_AC}
    // >
    <div className="vads-l-grid-container">
      <Breadcrumbs />
      <div className="secure-messaging-container">
        <div className="secure-messaging-navigation">
          <Navigation />
        </div>
        <div className="main-content">
          <h1>Messages</h1>
          <p className="va-introtext">
            When you send a message to your care team, it can take up to 3
            business days to get a response.
          </p>
          <EmergencyNote />
          <p>
            <a
              className="vads-c-action-link--blue compose-message-link"
              href="/my-health/secure-messages/compose"
            >
              Compose message
            </a>
          </p>
          <div className="search-messages-input">
            <label htmlFor="search-message-folder-input">
              Search the Messages folder
            </label>
            <VaSearchInput
              label="search-message-folder-input"
              // onInput={function noRefCheck() {}}
              // onSubmit={function noRefCheck() {}}
            />
          </div>

          <div>{content}</div>
        </div>
      </div>
    </div>

    // </RequiredLoginView>
  );
};

export default LandingPageAuth;
