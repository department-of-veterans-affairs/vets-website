import PropTypes from 'prop-types';
import React from 'react';

class MoveToOption extends React.Component {
  render() {
    const folderHtmlId = `msg-move-${this.props.messageId}-${this.props.folderId}`;

    return (
      <div>
        <input
          className="msg-hidden-radio"
          name="messagingMoveToFolder"
          type="radio"
          id={folderHtmlId}
          value={this.props.folderId}/>
        <label
          className="msg-move-to-label"
          htmlFor={folderHtmlId}>{this.props.folderName}</label>
      </div>
    );
  }
}

MoveToOption.propTypes = {
  folderName: PropTypes.string,
  folderId: PropTypes.number,
  messageId: PropTypes.number
};

export default MoveToOption;
