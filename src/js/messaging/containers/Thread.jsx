import React from 'react';
import { connect } from 'react-redux';

import { fetchThread, setVisibleDetails } from '../actions/messages';
import Message from '../components/Message';
import MessageSend from '../components/compose/MessageSend';
import MessageWrite from '../components/compose/MessageWrite';
import NoticeBox from '../components/NoticeBox';
import { composeMessagePlaceholders } from '../config';

class Thread extends React.Component {
  constructor(props) {
    super(props);
    this.handleReplyChange = this.handleReplyChange.bind(this);
    this.handleReplySave = this.handleReplySave.bind(this);
    this.handleReplySend = this.handleReplySend.bind(this);
    this.handleReplyDelete = this.handleReplyDelete.bind(this);
  }

  componentDidMount() {
    const id = this.props.params.id;
    this.props.fetchThread(id);
  }

  handleReplyChange() {
  }

  handleReplySave() {
  }

  handleReplySend() {
  }

  handleReplyDelete() {
  }

  render() {
    const thread = this.props.thread;
    let subject;
    let lastSender;
    let messages;

    if (thread.length > 0) {
      subject = thread[0].subject;
      lastSender = thread[thread.length - 1].sender_name;
      messages = thread.map((message) => {
        const detailsVisible =
          this.props.visibleDetailsId === message.message_id;

        return (
          <Message
              key={message.message_id}
              attrs={message}
              setVisibleDetails={this.props.setVisibleDetails}
              detailsVisible={detailsVisible}/>
        );
      });
    }

    return (
      <div>
        <h2 className="messaging-thread-name">{subject}</h2>
        <div>
          {messages}
        </div>
        <div className="messaging-thread-reply">
          <div className="messaging-thread-reply-recipient">
            <label>To:</label>
            {lastSender}
          </div>
          <MessageWrite
              cssClass="messaging-write"
              onValueChange={this.handleReplyChange}
              placeholder={composeMessagePlaceholders.message}/>
          <MessageSend
              cssClass="messaging-send-group"
              onSave={this.handleReplySave}
              onSend={this.handleReplySend}
              onDelete={this.handleReplyDelete}/>
        </div>
        <NoticeBox/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    thread: state.messages.data.thread,
    visibleDetailsId: state.messages.ui.visibleDetailsId
  };
};

const mapDispatchToProps = {
  fetchThread,
  setVisibleDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(Thread);
