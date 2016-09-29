import React from 'react';
import classNames from 'classnames';

import ButtonClose from '../buttons/ButtonClose';

class MessageUploadedAttachment extends React.Component {
  render() {
    const cssClass = classNames(
      'msg-attachment',
      this.props.cssClass
    );

    const attachmentIndexData = JSON.stringify({
      attachment: this.props.attachmentIndex
    });

    return (
      <div className={cssClass}>
        <span className="msg-attachment-name">{this.props.fileName}</span>
        <span className="msg-attachment-size">({this.props.fileSize})</span>
        <ButtonClose
            args={attachmentIndexData}
            className="msg-attachment-close"
            onClick={this.props.onClose}/>
      </div>
    );
  }
}

MessageUploadedAttachment.propTypes = {
  attachmentIndex: React.PropTypes.number.isRequired,
  cssClass: React.PropTypes.string,
  fileName: React.PropTypes.string.isRequired,
  fileSize: React.PropTypes.string.isRequired,
  onClose: React.PropTypes.func.isRequired
};

export default MessageUploadedAttachment;
