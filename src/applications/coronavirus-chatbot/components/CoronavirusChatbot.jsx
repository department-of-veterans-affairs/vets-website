import React from 'react';
import ReactWebChat from 'botframework-webchat';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

class CoronavirusChatbot extends React.Component {
  render() {
    if (this.props.config) {
      const { directLine, store, userID, styleOptions } = this.props.config;

      return (
        <ReactWebChat
          directLine={directLine}
          store={store}
          userID={userID}
          styleOptions={styleOptions}
        />
      );
    }
    return <LoadingIndicator message={'Loading coronavirus chatbot...'} />;
  }
}

export default CoronavirusChatbot;
