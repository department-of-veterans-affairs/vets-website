import React from 'react';
import { Link } from 'react-router';

import { paths, systemFolders } from '../config';
import ButtonDelete from './buttons/ButtonDelete';
import MoveTo from './MoveTo';
import ButtonPrint from './buttons/ButtonPrint';
import MessageNav from './MessageNav';
import ToggleThread from './ToggleThread';

class ThreadHeader extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
  }

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
              onChooseFolder={this.props.onChooseFolder}
              onCreateFolder={this.props.onCreateFolder}
              onToggleMoveTo={this.props.onToggleMoveTo}
              threadId={this.props.threadId}/>
          <MessageNav
              currentRange={this.props.currentMessageNumber}
              messageCount={this.props.folderMessageCount}
              onClickPrev={this.props.onClickPrev}
              onClickNext={this.props.onClickNext}/>
          <ButtonDelete
              onClickHandler={this.handleDelete}/>
          <ButtonPrint/>
        </div>
        <div className="messaging-thread-title">
          <h2 className="messaging-thread-subject">{this.props.subject}</h2>
          <div className="messaging-thread-controls">
            {toggleThread}
            <ButtonDelete
                onClickHandler={this.handleDelete}/>
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
  onClickPrev: React.PropTypes.func,
  onClickNext: React.PropTypes.func,
  subject: React.PropTypes.string.isRequired,
  threadId: React.PropTypes.string.isRequired,
  threadMessageCount: React.PropTypes.number.isRequired,
  messagesCollapsed: React.PropTypes.bool,
  moveToIsOpen: React.PropTypes.bool,
  onChooseFolder: React.PropTypes.func,
  onCreateFolder: React.PropTypes.func,
  onToggleThread: React.PropTypes.func,
  onToggleMoveTo: React.PropTypes.func,
  persistedFolder: React.PropTypes.number
};

export default ThreadHeader;
