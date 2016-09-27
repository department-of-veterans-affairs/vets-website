import React from 'react';

class MoveToOption extends React.Component {
  render() {
    const folderHtmlId = `msg-move-to-${this.props.folderName}`;
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
  folderName: React.PropTypes.string,
  folderId: React.PropTypes.number
};

export default MoveToOption;
