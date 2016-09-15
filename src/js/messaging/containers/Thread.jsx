import React from 'react';
import { connect } from 'react-redux';

import { fetchThread } from '../actions/messages';
import Message from '../components/Message';
import NoticeBox from '../components/NoticeBox';

class Thread extends React.Component {
  componentWillMount() {
    const id = this.props.params.id;
    this.props.dispatch(fetchThread(id));
  }

  render() {
    const thread = this.props.thread;
    let subject;
    let messageCount;
    let messages;

    if (thread.length > 0) {
      subject = thread[0].subject;
      messages = thread.map((message, i) => <Message key={i} attrs={message}/>);

      if (thread.length > 1) {
        messageCount = <span> ({thread.length})</span>;
      }
    }

    return (
      <div>
        <p className="messaging-thread-note">
          <strong>Note:</strong> This message may not be from the person you
          originally messaged. It may have been reassigned in an effort to
          address your question as effectively and efficiently as possible.
        </p>
        <h2 className="messaging-thread-name">{subject}{messageCount}</h2>
        <div>
          {messages}
        </div>
        <div className="messaging-thread-reply">
          <textarea placeholder="Click here to reply"/>
        </div>
        <NoticeBox/>
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
