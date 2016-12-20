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
  saveDraft,
  sendMessage,
  toggleConfirmDelete,
  toggleConfirmSave,
  toggleMessageCollapsed,
  toggleMessagesCollapsed,
  toggleReplyDetails,
  toggleThreadForm,
  toggleThreadMoveTo,
  updateDraft
} from '../actions';

import Message from '../components/Message';
import NoticeBox from '../components/NoticeBox';
import ThreadHeader from '../components/ThreadHeader';
import ModalConfirmDelete from '../components/compose/ModalConfirmDelete';
import ModalConfirmSave from '../components/compose/ModalConfirmSave';
import NewMessageForm from '../components/forms/NewMessageForm';
import ReplyForm from '../components/forms/ReplyForm';

export class Thread extends React.Component {
  constructor(props) {
    super(props);
    this.apiFormattedDraft = this.apiFormattedDraft.bind(this);
    this.getCurrentFolder = this.getCurrentFolder.bind(this);
    this.handleConfirmDraftSave = this.handleConfirmDraftSave.bind(this);
    this.handleDraftDelete = this.handleDraftDelete.bind(this);
    this.handleDraftSave = this.handleDraftSave.bind(this);
    this.handleDraftSend = this.handleDraftSend.bind(this);
    this.handleMessageDelete = this.handleMessageDelete.bind(this);
    this.makeHeader = this.makeHeader.bind(this);
    this.makeThread = this.makeThread.bind(this);
    this.makeForm = this.makeForm.bind(this);
  }

  componentDidMount() {
    const { loading, redirect } = this.props;

    if (redirect) {
      this.context.router.replace(redirect);
    } else if (!loading.thread) {
      this.props.fetchThread(+this.props.params.messageId);
    }
  }

  componentDidUpdate() {
    const { lastRequestedId, loading, isNewMessage, recipients } = this.props;

    if (!loading.thread) {
      const shouldFetchRecipients =
        !loading.recipients && isNewMessage && !recipients;

      if (shouldFetchRecipients) {
        this.props.fetchRecipients();
      }

      const requestedId = +this.props.params.messageId;
      const shouldFetchMessage = requestedId !== lastRequestedId;

      if (shouldFetchMessage) {
        this.props.fetchThread(requestedId);
      }
    }
  }

  getCurrentFolder() {
    const folderName = this.props.params.folderName;
    const folder = this.props.folders.get(folderName);
    return folder;
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

  handleConfirmDraftSave() {
    if (this.props.modals.saveConfirm.visible) {
      this.props.toggleConfirmSave();
    }

    this.props.saveDraft(this.apiFormattedDraft());
  }

  handleDraftSave() {
    if (this.props.draft.attachments.length) {
      this.props.toggleConfirmSave();
    } else {
      this.handleConfirmDraftSave();
    }
  }

  handleDraftSend() {
    this.props.sendMessage(this.apiFormattedDraft());
  }

  handleMessageDelete() {
    this.props.deleteMessage(this.props.message.messageId);
  }

  makeHeader() {
    const {
      folderMessages,
      folders,
      isSavedDraft,
      message,
      messagesCollapsed,
      moveToOpened,
      thread
    } = this.props;

    if (!message) {
      return null;
    }

    // Find the current message's position
    // among the messages in the current folder.
    const currentIndex = folderMessages.findIndex((folderMessage) => {
      return folderMessage.messageId === message.messageId;
    });

    // TODO: Enable navigating to messages outside of the current page.
    const handleMessageSelect = (messageNumber) => {
      const index = messageNumber - 1;
      const selectedId = folderMessages[index].messageId;
      this.context.router.push(`/${this.props.params.folderName}/${selectedId}`);
    };

    // If the message is a draft, the delete button should prompt, since the
    // draft would get deleted entirely instead of being moved to a folder.
    const deleteMessageHandler = isSavedDraft
                               ? this.props.toggleConfirmDelete
                               : this.handleMessageDelete;

    return (
      <ThreadHeader
          currentFolder={this.getCurrentFolder()}
          currentMessageNumber={currentIndex + 1}
          folderMessageCount={folderMessages.length}
          folders={Array.from(folders.values())}
          message={message}
          onMessageSelect={handleMessageSelect}
          threadMessageCount={thread.length + 1}
          messagesCollapsed={(messagesCollapsed.size > 0)}
          moveToIsOpen={moveToOpened}
          onChooseFolder={this.props.moveMessageToFolder}
          onCreateFolder={this.props.openMoveToNewFolderModal}
          onDeleteMessage={deleteMessageHandler}
          onToggleThread={this.props.toggleMessagesCollapsed}
          onToggleMoveTo={this.props.toggleThreadMoveTo}/>
    );
  }

  makeThread() {
    const { isSavedDraft, message, messagesCollapsed, thread } = this.props;

    let threadMessages;
    let currentMessage;

    if (thread) {
      threadMessages = thread.map((threadMessage) => {
        const isCollapsed =
          messagesCollapsed.has(threadMessage.messageId);

        return (
          <Message
              key={threadMessage.messageId}
              attrs={threadMessage}
              isCollapsed={isCollapsed}
              onToggleCollapsed={this.props.toggleMessageCollapsed}
              fetchMessage={this.props.fetchThreadMessage}/>
        );
      });
    }


    if (!isSavedDraft && message) {
      currentMessage = <Message attrs={message}/>;
    }

    return (
      <div className="messaging-thread-messages">
        {threadMessages}
        {currentMessage}
      </div>
    );
  }

  makeForm() {
    const { draft, isNewMessage, message, recipients } = this.props;
    let form;

    if (isNewMessage) {
      form = (
        <NewMessageForm
            message={draft}
            recipients={recipients}
            onAttachmentsClose={this.props.deleteDraftAttachment}
            onAttachmentUpload={this.props.addDraftAttachments}
            onAttachmentsError={this.props.openAttachmentsModal}
            onBodyChange={this.props.updateDraft.bind(null, 'body')}
            onCategoryChange={this.props.updateDraft.bind(null, 'category')}
            onFetchRecipients={this.props.fetchRecipients}
            onRecipientChange={this.props.updateDraft.bind(null, 'recipient')}
            onSaveMessage={this.handleDraftSave}
            onSendMessage={this.handleDraftSend}
            onSubjectChange={this.props.updateDraft.bind(null, 'subject')}
            toggleConfirmDelete={this.props.toggleConfirmDelete}/>
      );
    } else if (message) {
      form = (
        <ReplyForm
            detailsCollapsed={this.props.replyDetailsCollapsed}
            recipient={message.senderName}
            subject={message.subject}
            reply={draft}
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
    const { isFormVisible, isNewMessage, isSavedDraft, loading } = this.props;

    if (isNewMessage && loading.recipients) {
      return <LoadingIndicator message="Loading your application..."/>;
    }

    if (loading.thread) {
      return <LoadingIndicator message="Loading your message..."/>;
    }

    if (!this.props.message) {
      const lastRequestedId = this.props.lastRequestedId;

      if (lastRequestedId !== null) {
        const reloadMessage = () => {
          this.props.fetchThread(lastRequestedId);
        };

        return (
          <p>
            Could not retrieve the message.&nbsp;
            <a onClick={reloadMessage}>Click here to try again.</a>
          </p>
        );
      }

      return <p>Sorry, this message does not exist.</p>;
    }

    const header = this.makeHeader();
    const thread = this.makeThread();
    const form = this.makeForm();

    const threadClass = classNames({
      'messaging-thread-content': true,
      opened: !isFormVisible
    });

    const formClass = classNames({
      'messaging-thread-form': true,
      opened: isFormVisible
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
              {isSavedDraft ? 'Edit draft' : 'Reply'}
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
            <h2>{isNewMessage ? 'Edit draft' : 'Reply'}</h2>
            <button
                className="messaging-send-button"
                type="button"
                onClick={this.handleDraftSend}
                disabled={!this.props.draft.body.value.length}>
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
        <ModalConfirmSave
            cssClass="messaging-modal"
            onClose={this.props.toggleConfirmSave}
            onSave={this.handleConfirmDraftSave}
            visible={this.props.modals.saveConfirm.visible}/>
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
    isFormVisible: state.messages.ui.formVisible,
    isNewMessage,
    isSavedDraft,
    lastRequestedId: state.messages.ui.lastRequestedId,
    loading: state.loading,
    message,
    messagesCollapsed: state.messages.ui.messagesCollapsed,
    modals: state.modals,
    moveToOpened: state.messages.ui.moveToOpened,
    recipients: state.recipients.data,
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
  saveDraft,
  sendMessage,
  toggleConfirmDelete,
  toggleConfirmSave,
  toggleMessageCollapsed,
  toggleMessagesCollapsed,
  toggleThreadMoveTo,
  toggleReplyDetails,
  toggleThreadForm,
  updateDraft
};

export default connect(mapStateToProps, mapDispatchToProps)(Thread);
