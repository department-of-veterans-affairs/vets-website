import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

import MessageDetails from './MessageDetails';

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggleCollapsed = this.handleToggleCollapsed.bind(this);
  }

  handleToggleCollapsed() {
    this.props.onToggleCollapsed(this.props.attrs.message_id);
  }

  render() {
    const messageClass = classNames({
      'messaging-thread-message': true,
      'messaging-thread-message--collapsed': this.props.isCollapsed
    });

    let details;
    let headerOnClick;
    let messageOnClick;

    if (this.props.isCollapsed) {
      messageOnClick = this.handleToggleCollapsed;
    } else {
      details = (
        <div className="messaging-message-recipient">
          to {this.props.attrs.recipient_name}
          <MessageDetails { ...this.props }/>
        </div>
      );

      headerOnClick = this.handleToggleCollapsed;
    }

    return (
      <div className={messageClass} onClick={messageOnClick}>
        <div
            className="messaging-message-header"
            onClick={headerOnClick}>
          <div className="messaging-message-sender">
            {this.props.attrs.sender_name}
          </div>
          <div className="messaging-message-sent-date">
            {
              moment(
                this.props.attrs.sent_date
              ).format('DD MMM YYYY [@] HH[:]mm')
            }
          </div>
          {details}
        </div>
        <p className="messaging-message-body">
          {this.props.attrs.body}
        </p>
      </div>
    );
  }
}

Message.propTypes = {
  attrs: React.PropTypes.shape({
    // TODO: Remove when we switch to camel case.
    // Lack of camel case makes eslint complain.
    /* eslint-disable */
    message_id: React.PropTypes.number.isRequired,
    category: React.PropTypes.string.isRequired,
    subject: React.PropTypes.string.isRequired,
    body: React.PropTypes.string.isRequired,
    attachment: React.PropTypes.bool.isRequired,
    sent_date: React.PropTypes.string.isRequired,
    sender_id: React.PropTypes.number.isRequired,
    sender_name: React.PropTypes.string.isRequired,
    recipient_id: React.PropTypes.number.isRequired,
    recipient_name: React.PropTypes.string.isRequired,
    read_receipt: React.PropTypes.oneOf(['READ', 'UNREAD']).isRequired
    /* eslint-enable */
  }).isRequired,
  isCollapsed: React.PropTypes.bool,
  onToggleCollapsed: React.PropTypes.func,
  hasVisibleDetails: React.PropTypes.bool,
  setVisibleDetails: React.PropTypes.func
};

export default Message;
