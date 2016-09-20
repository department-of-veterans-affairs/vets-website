import React from 'react';
import { connect } from 'react-redux';

import {
  fetchThread,
  setVisibleDetails,
  toggleMessagesCollapsed,
  updateReplyCharacterCount
} from '../actions/messages';

import Message from '../components/Message';
import MessageSend from '../components/compose/MessageSend';
import MessageWrite from '../components/compose/MessageWrite';
import NoticeBox from '../components/NoticeBox';
import ThreadHeader from '../components/ThreadHeader';

import {
  composeMessageMaxChars,
  composeMessagePlaceholders
} from '../config';

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

  handleReplyChange(valueObj) {
    this.props.updateReplyCharacterCount(valueObj, composeMessageMaxChars);
  }

  handleReplySave() {
  }

  handleReplySend() {
  }

  handleReplyDelete() {
  }

  render() {
    const thread = this.props.thread;
    let lastSender;
    let header;
    let messages;

    if (thread.length > 0) {
      lastSender = thread[thread.length - 1].sender_name;

      header = (
        <ThreadHeader
            title={thread[0].subject}
            messagesCollapsed={this.props.messagesCollapsed}
            onToggleThread={this.props.toggleMessagesCollapsed}/>
      );

      messages = thread.map((message, i) => {
        const isCollapsed = this.props.messagesCollapsed &&
                            (i !== thread.length - 1);
        const detailsVisible =
          this.props.visibleDetailsId === message.message_id;

        return (
          <Message
              key={message.message_id}
              attrs={message}
              isCollapsed={isCollapsed}
              detailsVisible={detailsVisible}
              setVisibleDetails={this.props.setVisibleDetails}/>
        );
      });
    }

    return (
      <div>
        {header}
        <div className="messaging-thread-messages">
          {messages}
        </div>
        <form className="messaging-thread-reply">
          <div className="messaging-thread-reply-recipient">
            <label>To:</label>
            {lastSender}
          </div>
          <MessageWrite
              cssClass="messaging-write"
              onValueChange={this.handleReplyChange}
              placeholder={composeMessagePlaceholders.message}/>
          <MessageSend
              charCount={this.props.charsRemaining}
              cssClass="messaging-send-group"
              onSave={this.handleReplySave}
              onSend={this.handleReplySend}
              onDelete={this.handleReplyDelete}/>
        </form>
        <NoticeBox/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    charsRemaining: state.messages.ui.charsRemaining,
    folderMessages: state.folders.data.currentItem.messages,
    messagesCollapsed: state.messages.ui.messagesCollapsed,
    thread: state.messages.data.thread,
    visibleDetailsId: state.messages.ui.visibleDetailsId
  };
};

const mapDispatchToProps = {
  fetchThread,
  toggleMessagesCollapsed,
  setVisibleDetails,
  updateReplyCharacterCount
};

export default connect(mapStateToProps, mapDispatchToProps)(Thread);
