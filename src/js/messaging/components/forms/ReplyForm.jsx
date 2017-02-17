import React from 'react';
import classNames from 'classnames';

import { allowedMimeTypes, composeMessage } from '../../config';
import * as validations from '../../utils/validations';
import MessageWriteGroup from '../compose/MessageWriteGroup';

class ReplyForm extends React.Component {
  render() {
    const reply = this.props.reply;

    const detailsClass = classNames({
      'msg-reply-details': true,
      opened: !this.props.detailsCollapsed
    });

    const replyDetails = (
      <div
          className={detailsClass}
          onClick={this.props.toggleDetails}>
        <div className="msg-reply-detail">
          <label>Reply to:</label> {this.props.recipient}
        </div>
        <div className="msg-reply-detail">
          <label>Subject line:</label> {this.props.subject}
        </div>
      </div>
    );

    return (
      <form id="msg-reply">
        {replyDetails}
        <MessageWriteGroup
            disabled={this.props.disabled}
            allowedMimeTypes={allowedMimeTypes}
            errorMessage={validations.isValidMessageBody(reply.body) ? undefined : composeMessage.errors.message}
            files={reply.attachments}
            maxFiles={composeMessage.attachments.maxNum}
            maxFileSize={composeMessage.attachments.maxSingleFile}
            maxTotalFileSize={composeMessage.attachments.maxTotalFiles}
            onAttachmentsClose={this.props.onAttachmentsClose}
            onAttachmentUpload={this.props.onAttachmentUpload}
            onAttachmentsError={this.props.onAttachmentsError}
            onDelete={this.props.toggleConfirmDelete}
            onTextChange={this.props.onBodyChange}
            onSave={this.props.onSaveReply}
            onSend={this.props.onSendReply}
            messageText={reply.body}
            placeholder={composeMessage.placeholders.message}/>
      </form>
    );
  }
}

ReplyForm.propTypes = {
  disabled: React.PropTypes.bool,
  detailsCollapsed: React.PropTypes.bool,
  recipient: React.PropTypes.string.isRequired,
  subject: React.PropTypes.string.isRequired,
  reply: React.PropTypes.shape({
    body: React.PropTypes.shape({
      value: React.PropTypes.string,
      dirty: React.PropTypes.bool
    }),
    attachments: React.PropTypes.array
  }).isRequired,

  onAttachmentsClose: React.PropTypes.func,
  onAttachmentUpload: React.PropTypes.func,
  onAttachmentsError: React.PropTypes.func,
  onBodyChange: React.PropTypes.func,
  onSaveReply: React.PropTypes.func.isRequired,
  onSendReply: React.PropTypes.func.isRequired,
  toggleConfirmDelete: React.PropTypes.func,
  toggleDetails: React.PropTypes.func
};

export default ReplyForm;
