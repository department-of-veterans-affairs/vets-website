import React from 'react';
import classNames from 'classnames';

import { formattedDate } from '../utils/helpers';
import MessageDetails from './MessageDetails';
import MessageAttachmentsView from './MessageAttachmentsView';

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggleCollapsed = this.handleToggleCollapsed.bind(this);
  }

  componentDidUpdate() {
    const shouldFetchMessage =
      !this.props.isCollapsed &&
      this.props.attrs.attachment &&
      !this.props.attrs.attachments;

    if (shouldFetchMessage) {
      this.props.fetchMessage(this.props.attrs.messageId);
    }
  }

  handleToggleCollapsed() {
    if (this.props.onToggleCollapsed) {
      this.props.onToggleCollapsed(this.props.attrs.messageId);
    }
  }

  render() {
    const messageClass = classNames({
      'messaging-thread-message': true,
      'messaging-thread-message--collapsed': this.props.isCollapsed,
      'messaging-thread-message--expanded': !this.props.isCollapsed
    });

    let details;
    let headerOnClick;
    let messageOnClick;
    let attachments;

    if (this.props.isCollapsed) {
      messageOnClick = this.handleToggleCollapsed;
    } else {
      details = (
        <div className="messaging-message-recipient">
          to {this.props.attrs.recipientName}
          <MessageDetails { ...this.props }/>
        </div>
      );

      headerOnClick = this.handleToggleCollapsed;

      if (this.props.attrs.attachment) {
        attachments = (
          <MessageAttachmentsView
              attachments={this.props.attrs.attachments}/>
        );
      }
    }

    return (
      <div className={messageClass} onClick={messageOnClick}>
        <div
            className="messaging-message-header"
            onClick={headerOnClick}>
          <div className="messaging-message-sent-date">
            {formattedDate(this.props.attrs.sentDate, { fromNow: true })}
          </div>
          <div className="messaging-message-sender">
            {this.props.attrs.senderName}
          </div>
          {details}
        </div>
        <div className="messaging-message-body">
          {this.props.attrs.body}
        </div>
        {attachments}
      </div>
    );
  }
}

Message.propTypes = {
  attrs: React.PropTypes.shape({
    messageId: React.PropTypes.number.isRequired,
    category: React.PropTypes.string.isRequired,
    subject: React.PropTypes.string.isRequired,
    body: React.PropTypes.string.isRequired,
    attachment: React.PropTypes.bool.isRequired,
    sentDate: React.PropTypes.string.isRequired,
    senderId: React.PropTypes.number.isRequired,
    senderName: React.PropTypes.string.isRequired,
    recipientId: React.PropTypes.number.isRequired,
    recipientName: React.PropTypes.string.isRequired,
    readReceipt: React.PropTypes.oneOf(['READ', 'UNREAD'])
  }).isRequired,
  isCollapsed: React.PropTypes.bool,
  onToggleCollapsed: React.PropTypes.func,
  fetchMessage: React.PropTypes.func
};

export default Message;
