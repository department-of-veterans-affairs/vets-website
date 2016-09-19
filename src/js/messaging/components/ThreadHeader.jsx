import React from 'react';

import ButtonDelete from './buttons/ButtonDelete';
import ButtonPrint from './buttons/ButtonPrint';
import ToggleThread from './ToggleThread';

class ThreadHeader extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
  }

  render() {
    return (
      <div className="messaging-thread-header">
        <h2 className="messaging-thread-subject">{this.props.title}</h2>
        <div className="messaging-thread-controls">
          <ToggleThread
              messagesCollapsed={this.props.messagesCollapsed}
              onClick={this.props.onToggleThread}/>
          <ButtonDelete
              onClickHandler={this.handleDelete}/>
          <ButtonPrint/>
        </div>
      </div>
    );
  }
}

ThreadHeader.propTypes = {
  title: React.PropTypes.string.isRequired,
  messagesCollapsed: React.PropTypes.bool,
  onToggleThread: React.PropTypes.func
};

export default ThreadHeader;
