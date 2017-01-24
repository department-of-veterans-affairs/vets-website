import React from 'react';
import classNames from 'classnames';

import ButtonBack from './buttons/ButtonBack';
import ButtonDelete from './buttons/ButtonDelete';
import MoveTo from './MoveTo';
import MessageNav from './MessageNav';
import ToggleThread from './ToggleThread';
import { folderUrl } from '../utils/helpers';

class ThreadHeader extends React.Component {
  render() {
    const {
      currentFolder,
      folderMessageCount,
      isNewMessage,
      message,
      threadMessageCount
    } = this.props;

    const folderName = currentFolder.name;
    let messageNav;
    let moveTo;
    let deleteButton;
    let toggleThread;

    if (folderMessageCount) {
      const { currentMessageNumber } = this.props;

      messageNav = (
        <MessageNav
            currentRange={currentMessageNumber}
            messageCount={folderMessageCount}
            onItemSelect={this.props.onMessageSelect}
            itemNumber={currentMessageNumber}
            totalItems={folderMessageCount}/>
      );
    }

    if (threadMessageCount > 1) {
      toggleThread = (
        <ToggleThread
            messagesCollapsed={this.props.messagesCollapsed}
            onClick={this.props.onToggleThread}/>
      );
    }

    // Hide the 'Delete' button for drafts and sent messages,
    // since drafts should only be deletable from the form,
    // and sent messages can't be deleted.
    // Also hide the 'Move' button for drafts and sent messages,
    // since they can't be moved to other folders.
    if (folderName !== 'Sent' && folderName !== 'Drafts') {
      deleteButton =
        <ButtonDelete onClick={this.props.onDeleteMessage}/>;

      const { folders, moveToIsOpen } = this.props;

      moveTo = (
        <MoveTo
            currentFolder={currentFolder}
            folders={folders}
            isOpen={moveToIsOpen}
            messageId={message.messageId}
            onChooseFolder={this.props.onChooseFolder}
            onCreateFolder={this.props.onCreateFolder}
            onToggleMoveTo={this.props.onToggleMoveTo}/>
      );
    }

    const titleClass = classNames({
      'messaging-thread-title': true,
      'show-for-small-only': isNewMessage
    });

    const titleSection = (
      <div className={titleClass}>
        <div className="messaging-thread-controls">
          {toggleThread}
          {deleteButton}
        </div>
        <h2 className="messaging-thread-subject">{message.subject}</h2>
      </div>
    );

    return (
      <div className="messaging-thread-header">
        <div className="messaging-thread-nav">
          <ButtonBack url={folderUrl(folderName)}/>
          {messageNav}
          {moveTo}
          {deleteButton}
        </div>
        {titleSection}
      </div>
    );
  }
}

ThreadHeader.propTypes = {
  currentFolder: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired
  }),
  currentMessageNumber: React.PropTypes.number.isRequired,
  folderMessageCount: React.PropTypes.number.isRequired,
  folders: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      folderId: React.PropTypes.number.isRequired,
      name: React.PropTypes.string.isRequired,
      count: React.PropTypes.number.isRequired,
      unreadCount: React.PropTypes.number.isRequired
    })
  ).isRequired,
  isNewMessage: React.PropTypes.bool,
  message: React.PropTypes.shape({
    messageId: React.PropTypes.number,
    subject: React.PropTypes.string
  }).isRequired,
  messagesCollapsed: React.PropTypes.bool,
  moveToIsOpen: React.PropTypes.bool,
  onChooseFolder: React.PropTypes.func,
  onCreateFolder: React.PropTypes.func,
  onDeleteMessage: React.PropTypes.func,
  onMessageSelect: React.PropTypes.func,
  onToggleThread: React.PropTypes.func,
  onToggleMoveTo: React.PropTypes.func,
  threadMessageCount: React.PropTypes.number
};

export default ThreadHeader;
