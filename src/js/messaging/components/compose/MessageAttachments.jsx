import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import { formatFileSize } from '../../utils/helpers';

import MessageUploadedAttachment from './MessageUploadedAttachment';

class MessageAttachments extends React.Component {
  render() {
    const cssClass = classNames(
      'msg-attachments',
      this.props.cssClass
    );

    const files = this.props.files.map((file, index) => {
      const fileSize = formatFileSize(file.size);
      const key = _.uniqueId('msg-att-');

      return (
        <li key={key}>
          <MessageUploadedAttachment
              attachmentIndex={index}
              fileName={file.name}
              fileSize={fileSize}
              onClose={this.props.onClose}/>
        </li>
      );
    });
    return (
      <div
          className={cssClass}
          hidden={this.props.hidden}>
        <div>
          <div className="msg-attachments-title">Attachments:</div>
          <ul className="msg-attachments-list">
            {files}
          </ul>
        </div>
      </div>
    );
  }
}

MessageAttachments.propTypes = {
  cssClass: React.PropTypes.string,
  files: React.PropTypes.array.isRequired,
  hidden: React.PropTypes.bool,
  onClose: React.PropTypes.func.isRequired
};

export default MessageAttachments;
