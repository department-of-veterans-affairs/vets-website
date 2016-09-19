import React from 'react';
import moment from 'moment';

import MessageDetails from './MessageDetails';

class Message extends React.Component {
  render() {
    return (
      <div className="messaging-thread-message">
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
        <div className="messaging-message-recipient">
          to {this.props.attrs.recipient_name}
          <MessageDetails { ...this.props }/>
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
  detailsVisible: React.PropTypes.bool,
  setVisibleDetails: React.PropTypes.func
};

export default Message;
