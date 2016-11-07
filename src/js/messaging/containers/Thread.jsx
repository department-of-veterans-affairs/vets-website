import React from 'react';
import { connect } from 'react-redux';

import {
  addDraftAttachments,
  clearDraft,
  deleteDraftAttachment,
  deleteMessage,
  fetchRecipients,
  fetchThread,
  moveMessageToFolder,
  openAttachmentsModal,
  openMoveToNewFolderModal,
  saveDraft,
  sendMessage,
  toggleConfirmDelete,
  toggleMessageCollapsed,
  toggleMessagesCollapsed,
  toggleMoveTo,
  toggleReplyDetails,
  updateDraft
} from '../actions';

import Message from '../components/Message';
import NoticeBox from '../components/NoticeBox';
import ThreadHeader from '../components/ThreadHeader';
import ModalConfirmDelete from '../components/compose/ModalConfirmDelete';
import NewMessageForm from '../components/forms/NewMessageForm';
import ReplyForm from '../components/forms/ReplyForm';

export class Thread extends React.Component {
  constructor(props) {
    super(props);
    this.apiFormattedDraft = this.apiFormattedDraft.bind(this);
    this.handleDraftDelete = this.handleDraftDelete.bind(this);
    this.handleDraftSave = this.handleDraftSave.bind(this);
    this.handleDraftSend = this.handleDraftSend.bind(this);
    this.handleMessageDelete = this.handleMessageDelete.bind(this);
    this.makeHeader = this.makeHeader.bind(this);
    this.makeThread = this.makeThread.bind(this);
    this.makeForm = this.makeForm.bind(this);
  }

  componentDidMount() {
    const id = this.props.params.id;
    this.props.fetchThread(id);
  }

  componentDidUpdate() {
    if (this.props.isNewMessage && this.props.recipients.length === 0) {
      this.props.fetchRecipients();
    }

    const message = this.props.message;
    const newId = +this.props.params.id;

    if (!message || newId !== message.messageId) {
      this.props.fetchThread(newId);
    }
  }

  apiFormattedDraft() {
    const draft = this.props.draft;

    return {
      attachments: draft.attachments,
      body: draft.body.value,
      category: draft.category.value,
      messageId: draft.messageId,
      recipientId: +draft.recipient.value,
      replyMessageId: draft.replyMessageId,
      subject: draft.subject.value
    };
  }

  handleDraftDelete() {
    this.props.toggleConfirmDelete();
    this.props.clearDraft();

    if (this.props.isSavedDraft) {
      this.props.deleteMessage(this.props.message.messageId);
    }
  }

  handleDraftSave() {
    this.props.saveDraft(this.apiFormattedDraft());
  }

  handleDraftSend() {
    this.props.sendMessage(this.apiFormattedDraft());
  }

  handleMessageDelete() {
    this.props.deleteMessage(this.props.message.messageId);
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
      this.context.router.push(`/thread/${selectedId}`);
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
    let form;

    if (this.props.isNewMessage) {
      form = (
        <NewMessageForm
            message={this.props.draft}
            recipients={this.props.recipients}
            isDeleteModalVisible={this.props.modals.deleteConfirm.visible}
            onAttachmentsClose={this.props.deleteDraftAttachment}
            onAttachmentUpload={this.props.addDraftAttachments}
            onAttachmentsError={this.props.openAttachmentsModal}
            onBodyChange={this.props.updateDraft.bind(null, 'body')}
            onCategoryChange={this.props.updateDraft.bind(null, 'category')}
            onDeleteMessage={this.handleDraftDelete}
            onRecipientChange={this.props.updateDraft.bind(null, 'recipient')}
            onSaveMessage={this.handleDraftSave}
            onSendMessage={this.handleDraftSend}
            onSubjectChange={this.props.updateDraft.bind(null, 'subject')}
            toggleConfirmDelete={this.props.toggleConfirmDelete}/>
      );
    } else if (this.props.message) {
      form = (
        <ReplyForm
            detailsCollapsed={this.props.replyDetailsCollapsed}
            recipient={this.props.message.senderName}
            subject={this.props.message.subject}
            reply={this.props.draft}
            onAttachmentsClose={this.props.deleteDraftAttachment}
            onAttachmentUpload={this.props.addDraftAttachments}
            onAttachmentsError={this.props.openAttachmentsModal}
            onBodyChange={this.props.updateDraft.bind(null, 'body')}
            onSaveReply={this.handleDraftSave}
            onSendReply={this.handleDraftSend}
            toggleConfirmDelete={this.props.toggleConfirmDelete}
            toggleDetails={this.props.toggleReplyDetails}/>
      );
    }

    return form;
  }

  render() {
    const header = this.makeHeader();
    const thread = this.makeThread();
    const form = this.makeForm();

    return (
      <div>
        {header}
        {thread}
        <div className="messaging-thread-form">
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
            onDelete={this.handleDraftDelete}
            visible={this.props.modals.deleteConfirm.visible}/>
      </div>
    );
  }
}

Thread.contextTypes = {
  router: React.PropTypes.object.isRequired
};

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
    recipients: state.compose.recipients,
    replyDetailsCollapsed: state.messages.ui.replyDetailsCollapsed,
    thread: state.messages.data.thread
  };
};

const mapDispatchToProps = {
  addDraftAttachments,
  clearDraft,
  deleteDraftAttachment,
  deleteMessage,
  fetchRecipients,
  fetchThread,
  moveMessageToFolder,
  openAttachmentsModal,
  openMoveToNewFolderModal,
  saveDraft,
  sendMessage,
  toggleConfirmDelete,
  toggleMessageCollapsed,
  toggleMessagesCollapsed,
  toggleMoveTo,
  toggleReplyDetails,
  updateDraft
};

export default connect(mapStateToProps, mapDispatchToProps)(Thread);
