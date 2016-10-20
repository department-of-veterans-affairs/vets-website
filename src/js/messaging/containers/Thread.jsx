import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import {
  addDraftAttachments,
  clearDraft,
  deleteDraftAttachment,
  deleteMessage,
  fetchThread,
  moveMessageToFolder,
  openAttachmentsModal,
  openMoveToNewFolderModal,
  saveDraft,
  sendMessage,
  sendReply,
  toggleConfirmDelete,
  toggleMessageCollapsed,
  toggleMessagesCollapsed,
  toggleMoveTo,
  toggleReplyDetails,
  updateDraft
} from '../actions';

import Message from '../components/Message';
import MessageAttachments from '../components/compose/MessageAttachments';
import MessageSend from '../components/compose/MessageSend';
import MessageWrite from '../components/compose/MessageWrite';
import ModalConfirmDelete from '../components/compose/ModalConfirmDelete';
import NoticeBox from '../components/NoticeBox';
import ThreadHeader from '../components/ThreadHeader';

import { allowedMimeTypes, composeMessage } from '../config';

export class Thread extends React.Component {
  constructor(props) {
    super(props);
    this.apiFormattedDraft = this.apiFormattedDraft.bind(this);
    this.handleMessageDelete = this.handleMessageDelete.bind(this);
    this.handleReplySave = this.handleReplySave.bind(this);
    this.handleReplySend = this.handleReplySend.bind(this);
    this.handleReplyDelete = this.handleReplyDelete.bind(this);
    this.makeHeader = this.makeHeader.bind(this);
    this.makeThread = this.makeThread.bind(this);
    this.makeForm = this.makeForm.bind(this);
  }

  componentDidMount() {
    const id = this.props.params.id;
    this.props.fetchThread(id);
  }

  componentDidUpdate() {
    const newId = +this.props.params.id;
    if (newId !== this.props.message.messageId) {
      this.props.fetchThread(newId);
    }
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

  makeHeader() {
    if (!this.props.message) {
      return null;
    }

    // Exclude the current folder from the list of folders
    // that are passed down to the MoveTo component.
    const moveToFolders = this.props.folders.filter((folder) => {
      return folder.folderId !== this.props.persistFolder &&
             folder.name !== 'Sent';
    });

    const folderMessages = this.props.folderMessages;
    const folderMessageCount = folderMessages.length;

    // Find the current message's position
    // among the messages in the current folder.
    const currentIndex = folderMessages.findIndex((message) => {
      return message.messageId === this.props.message.messageId;
    });

    // TODO: Enable navigating to messages outside of the current page.
    const handleMessageSelect = (messageNumber) => {
      const index = messageNumber - 1;
      const selectedId = folderMessages[index].messageId;
      browserHistory.push(`/messaging/thread/${selectedId}`);
    };

    return (
      <ThreadHeader
          currentMessageNumber={currentIndex + 1}
          moveToFolders={moveToFolders}
          folderMessageCount={folderMessageCount}
          message={this.props.message}
          onMessageSelect={handleMessageSelect}
          persistedFolder={this.props.persistFolder}
          threadMessageCount={this.props.thread.length + 1}
          messagesCollapsed={(this.props.messagesCollapsed.size > 0)}
          moveToIsOpen={this.props.moveToOpened}
          onChooseFolder={this.props.moveMessageToFolder}
          onCreateFolder={this.props.openMoveToNewFolderModal}
          onDeleteMessage={this.handleMessageDelete}
          onToggleThread={this.props.toggleMessagesCollapsed}
          onToggleMoveTo={this.props.toggleMoveTo}/>
    );
  }

  makeThread() {
    let threadMessages;
    let currentMessage;

    if (this.props.thread) {
      threadMessages = this.props.thread.map((message) => {
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

    if (!this.props.isSavedDraft && this.props.message) {
      currentMessage = <Message attrs={this.props.message}/>;
    }

    return (
      <div className="messaging-thread-messages">
        {threadMessages}
        {currentMessage}
      </div>
    );
  }

  makeForm() {
    let replyDetails;
    const message = this.props.message;

    if (message) {
      let from;
      let subject;

      if (!this.props.replyDetailsCollapsed) {
        from = <div><label>From:</label> {message.recipientName}</div>;
        subject = <div><label>Subject line:</label> {message.subject}</div>;
      }

      replyDetails = (
        <div
            className="messaging-thread-reply-details"
            onClick={this.props.toggleReplyDetails}>
          <div><label>To:</label> {message.senderName}</div>
          {from}
          {subject}
        </div>
      );
    }

    return (
      <form>
        {replyDetails}
        <MessageWrite
            cssClass="messaging-write"
            onValueChange={this.props.updateDraft}
            placeholder={composeMessage.placeholders.message}
            text={this.props.draft.body}/>
        <MessageAttachments
            hidden={!this.props.draft.attachments.length}
            files={this.props.draft.attachments}
            onClose={this.props.deleteDraftAttachment}/>
        <MessageSend
            allowedMimeTypes={allowedMimeTypes}
            cssClass="messaging-send-group"
            maxFiles={composeMessage.attachments.maxNum}
            maxFileSize={composeMessage.attachments.maxSingleFile}
            maxTotalFileSize={composeMessage.attachments.maxTotalFiles}
            onAttachmentUpload={this.props.addDraftAttachments}
            onAttachmentsError={this.props.openAttachmentsModal}
            onSave={this.handleReplySave}
            onSend={this.handleReplySend}
            onDelete={this.props.toggleConfirmDelete}/>
      </form>
    );
  }

  render() {
    const header = this.makeHeader();
    const thread = this.makeThread();
    const form = this.makeForm();

    return (
      <div>
        {header}
        {thread}
        <div className="messaging-thread-reply">
          {form}
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
  const message = state.messages.data.message;
  const draft = state.messages.data.draft;

  const isSavedDraft = message && !message.sentDate;
  const isNewMessage = draft.replyMessageId === undefined;

  return {
    draft,
    folders: state.folders.data.items,
    folderMessages: folder.messages,
    isNewMessage,
    isSavedDraft,
    message,
    messagesCollapsed: state.messages.ui.messagesCollapsed,
    modals: state.modals,
    moveToOpened: state.messages.ui.moveToOpened,
    persistFolder: folder.persistFolder,
    replyDetailsCollapsed: state.messages.ui.replyDetailsCollapsed,
    thread: state.messages.data.thread
  };
};

const mapDispatchToProps = {
  addDraftAttachments,
  clearDraft,
  deleteDraftAttachment,
  deleteMessage,
  fetchThread,
  moveMessageToFolder,
  openAttachmentsModal,
  openMoveToNewFolderModal,
  saveDraft,
  sendMessage,
  sendReply,
  toggleConfirmDelete,
  toggleMessageCollapsed,
  toggleMessagesCollapsed,
  toggleMoveTo,
  toggleReplyDetails,
  updateDraft
};

export default connect(mapStateToProps, mapDispatchToProps)(Thread);
