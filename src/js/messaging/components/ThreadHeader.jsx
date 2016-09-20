import React from 'react';
import { Link } from 'react-router';

import { paths } from '../config';
import ButtonDelete from './buttons/ButtonDelete';
import ButtonMove from './buttons/ButtonMove';
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
            <ButtonMove/>
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
  folderMessageCount: React.PropTypes.number.isRequired,
  handlePrev: React.PropTypes.func,
  handleNext: React.PropTypes.func,
  subject: React.PropTypes.string.isRequired,
  threadMessageCount: React.PropTypes.number.isRequired,
  messagesCollapsed: React.PropTypes.bool,
  onToggleThread: React.PropTypes.func
};

export default ThreadHeader;
