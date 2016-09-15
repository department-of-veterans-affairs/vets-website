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
    let messages;

    if (thread.length > 0) {
      subject = thread[0].subject;
      messages = thread.map((message) => {
        return <Message key={message.message_id} attrs={message}/>;
      });
    }

    return (
      <div>
        <h2 className="messaging-thread-name">{subject}</h2>
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
