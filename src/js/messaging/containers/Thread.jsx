import React from 'react';
import { connect } from 'react-redux';

import {
  clearDraft,
  deleteMessage,
  fetchThread,
  moveMessageToFolder,
  openMoveToNewFolderModal,
  saveDraft,
  sendMessage,
  sendReply,
  toggleConfirmDelete,
  toggleMessageCollapsed,
  toggleMessagesCollapsed,
  toggleMoveTo,
  updateDraft
} from '../actions';

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
    this.apiFormattedDraft = this.apiFormattedDraft.bind(this);
    this.handleMessageDelete = this.handleMessageDelete.bind(this);
    this.handleReplySave = this.handleReplySave.bind(this);
    this.handleReplySend = this.handleReplySend.bind(this);
    this.handleReplyDelete = this.handleReplyDelete.bind(this);
  }

  componentDidMount() {
    const id = this.props.params.id;
    this.props.fetchThread(id);
  }

  apiFormattedDraft() {
    const draft = Object.assign({}, this.props.draft);
    draft.body = draft.body.value;
    return draft;
  }

  handleMessageDelete() {
    this.props.deleteMessage(this.props.message.messageId);
  }

  handleReplySave() {
    this.props.saveDraft(this.apiFormattedDraft());
  }

  handleReplySend() {
    if (this.props.isNewMessage) {
      this.props.sendMessage(this.apiFormattedDraft());
    } else {
      this.props.sendReply(this.apiFormattedDraft());
    }
  }

  handleReplyDelete() {
    this.props.toggleConfirmDelete();
    this.props.clearDraft();

    if (this.props.isSavedDraft) {
      this.props.deleteMessage(this.props.message.messageId);
    }
  }

  render() {
    const thread = this.props.thread;
    const folderMessages = this.props.folderMessages;
    const folderMessageCount = folderMessages.length;

    let lastSender;
    let header;
    let threadMessages;
    let currentMessage;

    // Exclude the current folder from the list of folders
    // that are passed down to the MoveTo component.
    const folders = this.props.folders.filter((folder) => {
      return folder.folderId !== this.props.persistFolder && folder.name !== 'Sent';
    });

    if (this.props.message) {
      // Find the current message's position
      // among the messages in the current folder.
      const currentIndex = folderMessages.findIndex((message) => {
        return message.messageId === this.props.message.messageId;
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
            message={this.props.message}
            onClickPrev={fetchPrevMessage}
            onClickNext={fetchNextMessage}
            persistedFolder={this.props.persistFolder}
            threadMessageCount={thread.length + 1}
            messagesCollapsed={(this.props.messagesCollapsed.size > 0)}
            moveToIsOpen={this.props.moveToOpened}
            onChooseFolder={this.props.moveMessageToFolder}
            onCreateFolder={this.props.openMoveToNewFolderModal}
            onDeleteMessage={this.handleMessageDelete}
            onToggleThread={this.props.toggleMessagesCollapsed}
            onToggleMoveTo={this.props.toggleMoveTo}/>
      );

      lastSender = this.props.message.senderName;

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

      if (!this.props.isSavedDraft) {
        currentMessage = <Message attrs={this.props.message}/>;
      }
    }

    return (
      <div>
        {header}
        <div className="messaging-thread-messages">
          {threadMessages}
          {currentMessage}
        </div>
        <div className="messaging-thread-reply">
          <form>
            <div className="messaging-thread-reply-recipient">
              <label>To:</label>
              {lastSender}
            </div>
            <MessageWrite
                cssClass="messaging-write"
                onValueChange={this.props.updateDraft}
                placeholder={composeMessage.placeholders.message}
                text={this.props.draft.body}/>
            <MessageSend
                charCount={this.props.draft.charsRemaining}
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
  const folder = state.folders.data.currentItem;
  const thread = state.messages.data.thread;
  const message = state.messages.data.message;
  const draft = state.messages.data.draft;

  const isSavedDraft = message && !message.sentDate;
  const isNewMessage = draft.replyMessageId === undefined;

  return {
    folders: state.folders.data.items,
    folderMessages: folder.messages,
    isNewMessage,
    isSavedDraft,
    message,
    messagesCollapsed: state.messages.ui.messagesCollapsed,
    modals: state.modals,
    moveToOpened: state.messages.ui.moveToOpened,
    persistFolder: folder.persistFolder,
    draft,
    thread
  };
};

const mapDispatchToProps = {
  clearDraft,
  deleteMessage,
  fetchThread,
  moveMessageToFolder,
  openMoveToNewFolderModal,
  saveDraft,
  sendMessage,
  sendReply,
  toggleConfirmDelete,
  toggleMessageCollapsed,
  toggleMessagesCollapsed,
  toggleMoveTo,
  updateDraft
};

export default connect(mapStateToProps, mapDispatchToProps)(Thread);
