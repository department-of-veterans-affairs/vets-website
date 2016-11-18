import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import LoadingIndicator from '../../common/components/LoadingIndicator';

import {
  addDraftAttachments,
  clearDraft,
  deleteDraftAttachment,
  deleteMessage,
  fetchFolder,
  fetchRecipients,
  fetchThread,
  fetchThreadMessage,
  moveMessageToFolder,
  openAttachmentsModal,
  openMoveToNewFolderModal,
  resetRedirect,
  saveDraft,
  sendMessage,
  toggleConfirmDelete,
  toggleMessageCollapsed,
  toggleMessagesCollapsed,
  toggleMoveTo,
  toggleReplyDetails,
  toggleThreadForm,
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
    this.getCurrentFolder = this.getCurrentFolder.bind(this);
    this.handleDraftDelete = this.handleDraftDelete.bind(this);
    this.handleDraftSave = this.handleDraftSave.bind(this);
    this.handleDraftSend = this.handleDraftSend.bind(this);
    this.handleMessageDelete = this.handleMessageDelete.bind(this);
    this.makeHeader = this.makeHeader.bind(this);
    this.makeThread = this.makeThread.bind(this);
    this.makeForm = this.makeForm.bind(this);
  }

  componentDidMount() {
    if (!this.props.loading.message) {
      const id = this.props.params.messageId;
      this.props.fetchThread(id);
    }
  }

  componentDidUpdate() {
    if (this.props.redirect) {
      this.context.router.push(this.props.redirect);
      return;
    }

    if (!this.props.loading.folder) {
      const currentFolder = this.getCurrentFolder();
      const shouldFetchFolder =
        currentFolder &&
        currentFolder.folderId !==
        this.props.folder.attributes.folderId;

      if (shouldFetchFolder) {
        this.props.fetchFolder(currentFolder.folderId);
      }
    }

    if (!this.props.loading.message) {
      if (this.props.isNewMessage && this.props.recipients.length === 0) {
        this.props.fetchRecipients();
      }

      const message = this.props.message;
      const newId = +this.props.params.messageId;

      if (!message || newId !== message.messageId) {
        this.props.fetchThread(newId);
      }
    }
  }

  componentWillUnmount() {
    this.props.resetRedirect();
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

  getCurrentFolder() {
    const folderName = this.props.params.folderName;
    const folder = this.props.folders.get(folderName);
    return folder;
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

    const currentFolder = this.getCurrentFolder();

    // Exclude the current folder from the list of folders
    // that are passed down to the MoveTo component.
    const moveToFolders = [];
    this.props.folders.forEach((folder) => {
      if (folder.folderId !== currentFolder.folderId) {
        moveToFolders.push(folder);
      }
    });

    const folderMessages = this.props.folder.messages;
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
          folderName={currentFolder.name}
          message={this.props.message}
          onMessageSelect={handleMessageSelect}
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
              onToggleCollapsed={this.props.toggleMessageCollapsed}
              fetchMessage={this.props.fetchThreadMessage}/>
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
    if (this.props.loading.message) {
      return <LoadingIndicator message="is loading the thread..."/>;
    }

    const header = this.makeHeader();
    const thread = this.makeThread();
    const form = this.makeForm();

    const threadClass = classNames({
      'messaging-thread-content': true,
      opened: !this.props.isFormVisible
    });

    const formClass = classNames({
      'messaging-thread-form': true,
      opened: this.props.isFormVisible
    });

    return (
      <div>
        <div className={threadClass}>
          {header}
          {thread}
          <div className="messaging-thread-form-trigger">
            <button
                className="usa-button"
                type="button"
                onClick={this.props.toggleThreadForm}>
              {this.props.isSavedDraft ? 'Edit draft' : 'Reply'}
            </button>
          </div>
        </div>
        <div className={formClass}>
          <div
              id="messaging-content-header"
              className="messaging-thread-header">
            <a
                className="messaging-cancel-link"
                onClick={this.props.toggleThreadForm}>
              Cancel
            </a>
            <h2>{this.props.isNewMessage ? 'New message' : 'Reply'}</h2>
            <button
                className="messaging-send-button"
                type="button">
              Send
            </button>
          </div>
          {form}
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
    folder,
    isFormVisible: state.messages.ui.formVisible,
    isNewMessage,
    isSavedDraft,
    loading: {
      message: state.messages.ui.loading,
      folder: state.folders.ui.loading
    },
    message,
    messagesCollapsed: state.messages.ui.messagesCollapsed,
    modals: state.modals,
    moveToOpened: state.messages.ui.moveToOpened,
    recipients: state.compose.recipients,
    redirect: state.folders.ui.redirect,
    replyDetailsCollapsed: state.messages.ui.replyDetailsCollapsed,
    thread: state.messages.data.thread
  };
};

const mapDispatchToProps = {
  addDraftAttachments,
  clearDraft,
  deleteDraftAttachment,
  deleteMessage,
  fetchFolder,
  fetchRecipients,
  fetchThread,
  fetchThreadMessage,
  moveMessageToFolder,
  openAttachmentsModal,
  openMoveToNewFolderModal,
  resetRedirect,
  saveDraft,
  sendMessage,
  toggleConfirmDelete,
  toggleMessageCollapsed,
  toggleMessagesCollapsed,
  toggleMoveTo,
  toggleReplyDetails,
  toggleThreadForm,
  updateDraft
};

export default connect(mapStateToProps, mapDispatchToProps)(Thread);
