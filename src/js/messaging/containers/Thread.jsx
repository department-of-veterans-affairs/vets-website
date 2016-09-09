import React from 'react';
import { connect } from 'react-redux';

import { fetchThread } from '../actions/messages';
import Message from '../components/Message';

class Thread extends React.Component {
  componentWillMount() {
    // TODO: When the API supports getting any thread,
    // fetch the thread with the id from the URL.
    // const id = this.props.param.id
    this.props.dispatch(fetchThread());
  }

  render() {
    const thread = this.props.thread;
    let subject;
    let messages;

    if (thread.length > 0) {
      subject = thread[0].subject;
      messages = thread.map((message, i) => <Message key={i} attrs={message}/>);
    }

    return (
      <div>
        <p className="messaging-thread-note">
          <strong>Note:</strong> This message may not be from the person you
          originally messaged. It may have been reassigned in an effort to
          address your question as effectively and efficiently as possible.
        </p>
        <h2 className="messaging-thread-name">{subject}</h2>
        <div>
          {messages}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    thread: state.messages.thread
  };
};

export default connect(mapStateToProps)(Thread);
