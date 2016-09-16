import React from 'react';

class MessageDetails extends React.Component {
  constructor(props) {
    super(props);
    this.handleShowDetails = this.handleShowDetails.bind(this);
  }

  handleShowDetails() {
    this.props.showDetails(this.props.attrs.message_id);
  }

  render() {
    let messageDetails;
    if (this.props.detailsVisible) {
      messageDetails = (
        <div className="messaging-message-details">
          <table>
            <tbody>
              <tr>
                <th>From:</th>
                <td>{this.props.attrs.sender_name}</td>
              </tr>
              <tr>
                <th>To:</th>
                <td>{this.props.attrs.recipient_name}</td>
              </tr>
              <tr>
                <th>Date:</th>
                <td>{this.props.attrs.sent_date}</td>
              </tr>
              <tr>
                <th>Message ID:</th>
                <td>{this.props.attrs.message_id}</td>
              </tr>
              <tr>
                <th>Category:</th>
                <td>{this.props.attrs.category}</td>
              </tr>
              <tr>
                <th>Subject Line:</th>
                <td>{this.props.attrs.subject}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <div className="messaging-message-details-control">
        <button onClick={this.handleShowDetails}>
          <i className="fa fa-caret-down"></i>
        </button>
        {messageDetails}
      </div>
    );
  }
}

MessageDetails.propTypes = {
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
  showDetails: React.PropTypes.func
};

export default MessageDetails;
