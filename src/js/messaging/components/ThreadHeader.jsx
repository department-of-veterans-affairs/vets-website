import React from 'react';
import { Link } from 'react-router';

import { paths } from '../config';
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

    if (this.props.threadMessageCount > 1) {
      toggleThread = (
        <ToggleThread
            messagesCollapsed={this.props.messagesCollapsed}
            onClick={this.props.onToggleThread}/>
      );
    }

    return (
      <div className="messaging-thread-header">
        <div className="messaging-thread-nav">
          <div>
            <Link to={paths.INBOX_URL}>&lt; Back to Inbox</Link>
            <MoveTo
                folders={this.props.folders}
                isOpen={!this.props.moveToIsOpen}
                onChooseFolder={this.props.onChooseFolder}
                onCreateFolder={this.props.onCreateFolder}
                onToggleMoveTo={this.props.onToggleMoveTo}
                threadId={this.props.threadId}/>
          </div>
          <MessageNav
              currentRange={this.props.currentMessageNumber}
              messageCount={this.props.folderMessageCount}
              handlePrev={this.props.handlePrev}
              handleNext={this.props.handleNext}/>
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
  folders: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      folderId: React.PropTypes.number.isRequired,
      name: React.PropTypes.string.isRequired,
      count: React.PropTypes.number.isRequired,
      unreadCount: React.PropTypes.number.isRequired
    })
  ).isRequired,
  folderMessageCount: React.PropTypes.number.isRequired,
  handlePrev: React.PropTypes.func,
  handleNext: React.PropTypes.func,
  subject: React.PropTypes.string.isRequired,
  threadId: React.PropTypes.string.isRequired,
  threadMessageCount: React.PropTypes.number.isRequired,
  messagesCollapsed: React.PropTypes.bool,
  moveToIsOpen: React.PropTypes.bool,
  onChooseFolder: React.PropTypes.func,
  onCreateFolder: React.PropTypes.func,
  onToggleThread: React.PropTypes.func,
  onToggleMoveTo: React.PropTypes.func,

};

export default ThreadHeader;
