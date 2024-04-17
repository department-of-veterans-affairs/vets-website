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
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import backendServices from 'platform/user/profile/constants/backendServices';
import { RequiredLoginView } from 'platform/user/authorization/components/RequiredLoginView';

import { getAllMessages } from '../actions';
// import Header from '../components/Header';
import MessageList from '../components/MessageList/MessageList';

const App = props => {
  const {
    allMessages: { isLoading, messages, error },
  } = props;

  // fire api call to retreive messages
  useEffect(() => {
    props.getAllMessages();
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
        {/* <Header /> */}
        <MessageList messages={messages} />
      </>
    );
  }

  return (
    <RequiredLoginView
      user={props.user}
      serviceRequired={backendServices.MHV_AC}
    >
      <div className="vads-l-grid-container">
        <div className="vads-l-row">{content}</div>
      </div>
    </RequiredLoginView>
  );
};

const mapStateToProps = state => ({
  user: state.user,
  allMessages: state.allMessages,
});

const mapDispatchToProps = {
  getAllMessages,
};

App.propTypes = {
  allMessages: PropTypes.object,
  getAllMessages: PropTypes.func,
  user: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
