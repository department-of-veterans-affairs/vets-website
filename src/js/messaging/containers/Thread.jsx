import React from 'react';
import { connect } from 'react-redux';

import {
  deleteReply,
  fetchThread,
  toggleMessageCollapsed,
  toggleMessagesCollapsed,
  toggleMoveTo,
  updateReplyBody,
  updateReplyCharacterCount
} from '../actions/messages';

import {
  toggleConfirmDelete,
  toggleCreateFolderModal
} from '../actions/modals';

import Message from '../components/Message';
import MessageSend from '../components/compose/MessageSend';
import MessageWrite from '../components/compose/MessageWrite';
import ModalConfirmDelete from '../components/compose/ModalConfirmDelete';
import NoticeBox from '../components/NoticeBox';
import ThreadHeader from '../components/ThreadHeader';

import { composeMessage } from '../config';

class Thread extends React.Component {
  constructor(props) {
    super(props);
    this.handleReplyChange = this.handleReplyChange.bind(this);
    this.handleReplySave = this.handleReplySave.bind(this);
    this.handleReplySend = this.handleReplySend.bind(this);
    this.handleReplyDelete = this.handleReplyDelete.bind(this);
    this.handleMoveTo = this.handleMoveTo.bind(this);
  }

  componentDidMount() {
    const id = this.props.params.id;
    this.props.fetchThread(id);
  }

  handleReplyChange(valueObj) {
    this.props.updateReplyBody(valueObj);
    this.props.updateReplyCharacterCount(valueObj, composeMessage.maxChars.message);
  }

  handleReplySave() {
  }

  handleReplySend() {
  }

  handleReplyDelete() {
    this.props.toggleConfirmDelete();
    this.props.deleteReply();
  }

  handleMoveTo() {
    // TODO: Make this call a function that dispatches an action
    // domEvent will bubble up from the radio button
    // to the form, which is why we're using currentTarget.
    // instead of target.
    // const folderId = domEvent.currentTarget.messagingMoveToFolder.value;
    // const threadId = domEvent.currentTarget.threadId.value;
  }

  render() {
    const thread = this.props.thread;
    const folderMessages = this.props.folderMessages;
    const folderMessageCount = folderMessages.length;
    let lastSender;
    let header;
    let threadMessages;

    // Exclude the current folder from the list of folders
    // that are passed down to the MoveTo component.
    const folders = this.props.folders.filter((folder) => {
      return folder.folderId !== this.props.persistFolder && folder.name !== 'Sent';
    });

    if (thread.length > 0) {
      const currentMessage = thread[thread.length - 1];

      // TODO: Presumably, when the API provides pagination,
      // we will be able to directly pull information about
      // the next and previous messages. Until then, we rely
      // on logic around the array of folder messages we get.

      // Find the current message's position
      // among the messages in the current folder.
      const currentIndex = folderMessages.findIndex((message) => {
        return message.messageId === currentMessage.messageId;
      });

      /* Once the position of current position has been determined,
         create functions to navigate to the previous and next
         messages within the folder.

         Then pass these functions to the navigation components. */

      let fetchPrevMessage;
      if (currentIndex - 1 >= 0) {
        const prevId = folderMessages[currentIndex - 1].messageId;
        fetchPrevMessage = () => {
          this.props.fetchThread(prevId);
        };
      }

      let fetchNextMessage;
      if (currentIndex + 1 < folderMessageCount) {
        const nextId = folderMessages[currentIndex + 1].messageId;
        fetchNextMessage = () => {
          this.props.fetchThread(nextId);
        };
      }

      header = (
        <ThreadHeader
            currentMessageNumber={currentIndex + 1}
            moveToFolders={folders}
            folderMessageCount={folderMessageCount}
            persistedFolder={this.props.persistFolder}
            onClickPrev={fetchPrevMessage}
            onClickNext={fetchNextMessage}
            subject={thread[0].subject}
            threadMessageCount={thread.length}
            threadId={this.props.params.id}
            messagesCollapsed={(this.props.messagesCollapsed.size > 0)}
            moveToIsOpen={this.props.moveToOpened}
            onChooseFolder={this.handleMoveTo}
            onCreateFolder={this.props.toggleCreateFolderModal}
            onToggleThread={this.props.toggleMessagesCollapsed}
            onToggleMoveTo={this.props.toggleMoveTo}/>
      );

      lastSender = currentMessage.senderName;

      threadMessages = thread.map((message) => {
        const isCollapsed =
          this.props.messagesCollapsed.has(message.messageId);

        return (
          <Message
              key={message.messageId}
              attrs={message}
              isCollapsed={isCollapsed}
              onToggleCollapsed={this.props.toggleMessageCollapsed}/>
        );
      });
    }

    return (
      <div>
        {header}
        <div className="messaging-thread-messages">
          {threadMessages}
        </div>
        <div className="messaging-thread-reply">
          <form>
            <div className="messaging-thread-reply-recipient">
              <label>To:</label>
              {lastSender}
            </div>
            <MessageWrite
                cssClass="messaging-write"
                onValueChange={this.handleReplyChange}
                placeholder={composeMessage.placeholders.message}
                text={this.props.reply.body}/>
            <MessageSend
                charCount={this.props.reply.charsRemaining}
                cssClass="messaging-send-group"
                onSave={this.handleReplySave}
                onSend={this.handleReplySend}
                onDelete={this.props.toggleConfirmDelete}/>
          </form>
          <button
              className="usa-button"
              type="button">
            Reply
          </button>
        </div>
        <NoticeBox/>
        <ModalConfirmDelete
            cssClass="messaging-modal"
            onClose={this.props.toggleConfirmDelete}
            onDelete={this.handleReplyDelete}
            visible={this.props.modals.deleteConfirm.visible}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    persistFolder: state.folders.data.currentItem.persistFolder,
    folders: state.folders.data.items,
    folderMessages: state.folders.data.currentItem.messages,
    messagesCollapsed: state.messages.ui.messagesCollapsed,
    modals: state.modals,
    moveToOpened: state.messages.ui.moveToOpened,
    reply: state.messages.data.reply,
    thread: state.messages.data.thread
  };
};

const mapDispatchToProps = {
  deleteReply,
  fetchThread,
  toggleConfirmDelete,
  toggleCreateFolderModal,
  toggleMessageCollapsed,
  toggleMessagesCollapsed,
  toggleMoveTo,
  updateReplyBody,
  updateReplyCharacterCount
};

export default connect(mapStateToProps, mapDispatchToProps)(Thread);
