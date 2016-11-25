import React from 'react';
import { Link } from 'react-router';

import ButtonDelete from './buttons/ButtonDelete';
import MoveTo from './MoveTo';
import MessageNav from './MessageNav';
import ToggleThread from './ToggleThread';
import { folderUrl } from '../utils/helpers';

class ThreadHeader extends React.Component {
  render() {
    let toggleThread;

    if (this.props.threadMessageCount > 1) {
      toggleThread = (
        <ToggleThread
            messagesCollapsed={this.props.messagesCollapsed}
            onClick={this.props.onToggleThread}/>
      );
    }

    const backUrl = folderUrl(this.props.folderName);

    return (
      <div className="messaging-thread-header">
        <div className="messaging-thread-nav">
          <Link to={backUrl}>&lt; Back to {this.props.folderName}</Link>
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
        </div>
        <div className="messaging-thread-title">
          <div className="messaging-thread-controls">
            {toggleThread}
            <ButtonDelete
                onClickHandler={this.props.onDeleteMessage}/>
          </div>
          <h2 className="messaging-thread-subject">{this.props.message.subject}</h2>
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
  folderName: React.PropTypes.string.isRequired,
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
  onToggleMoveTo: React.PropTypes.func
};

export default ThreadHeader;
