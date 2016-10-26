import React from 'react';
import { Link } from 'react-router';

import { paths, systemFolders } from '../config';
import ButtonDelete from './buttons/ButtonDelete';
import MoveTo from './MoveTo';
import ButtonPrint from './buttons/ButtonPrint';
import MessageNav from './MessageNav';
import ToggleThread from './ToggleThread';

class ThreadHeader extends React.Component {
  render() {
    let toggleThread;
    let returnUrlText;
    let returnUrlPath;

    if (this.props.threadMessageCount > 1) {
      toggleThread = (
        <ToggleThread
            messagesCollapsed={this.props.messagesCollapsed}
            onClick={this.props.onToggleThread}/>
      );
    }

    if (this.props.persistedFolder === undefined) {
      returnUrlText = 'Inbox';
      returnUrlPath = `${paths.FOLDERS_URL}/0`;
    } else {
      returnUrlText = systemFolders[Math.abs(this.props.persistedFolder)];
      returnUrlPath = `${paths.FOLDERS_URL}/${this.props.persistedFolder}`;
    }

    return (
      <div className="messaging-thread-header">
        <div className="messaging-thread-nav">
          <Link to={returnUrlPath}>&lt; Back to {returnUrlText}</Link>
          <MoveTo
              folders={this.props.moveToFolders}
              isOpen={!this.props.moveToIsOpen}
              messageId={this.props.message.messageId}
              onChooseFolder={this.props.onChooseFolder}
              onCreateFolder={this.props.onCreateFolder}
              onToggleMoveTo={this.props.onToggleMoveTo}/>
          <MessageNav
              currentRange={this.props.currentMessageNumber}
              messageCount={this.props.folderMessageCount}
              onItemSelect={this.props.onMessageSelect}
              itemNumber={this.props.currentMessageNumber}
              totalItems={this.props.folderMessageCount}/>
          <ButtonDelete
              onClickHandler={this.props.onDeleteMessage}/>
          <ButtonPrint/>
        </div>
        <div className="messaging-thread-title">
          <h2 className="messaging-thread-subject">{this.props.message.subject}</h2>
          <div className="messaging-thread-controls">
            {toggleThread}
            <ButtonDelete
                onClickHandler={this.props.onDeleteMessage}/>
            <ButtonPrint/>
          </div>
        </div>
      </div>
    );
  }
}

ThreadHeader.propTypes = {
  currentMessageNumber: React.PropTypes.number.isRequired,
  moveToFolders: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      folderId: React.PropTypes.number.isRequired,
      name: React.PropTypes.string.isRequired,
      count: React.PropTypes.number.isRequired,
      unreadCount: React.PropTypes.number.isRequired
    })
  ).isRequired,
  folderMessageCount: React.PropTypes.number.isRequired,
  message: React.PropTypes.shape({
    messageId: React.PropTypes.number,
    subject: React.PropTypes.string
  }).isRequired,
  threadMessageCount: React.PropTypes.number.isRequired,
  messagesCollapsed: React.PropTypes.bool,
  moveToIsOpen: React.PropTypes.bool,
  onChooseFolder: React.PropTypes.func,
  onCreateFolder: React.PropTypes.func,
  onDeleteMessage: React.PropTypes.func,
  onMessageSelect: React.PropTypes.func,
  onToggleThread: React.PropTypes.func,
  onToggleMoveTo: React.PropTypes.func,
  persistedFolder: React.PropTypes.number
};

export default ThreadHeader;
