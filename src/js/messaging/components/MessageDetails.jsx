import React from 'react';

class MessageDetails extends React.Component {
  constructor(props) {
    super(props);
    this.hideDetails = this.hideDetails.bind(this);
    this.showDetails = this.showDetails.bind(this);
  }

  componentDidUpdate() {
    // Focus on the details box if it has popped up so that
    // clicking outside of it can trigger the blur event to hide it.
    if (this.refs.messageDetails) {
      this.refs.messageDetails.focus();
    }
  }

  hideDetails() {
    this.props.setVisibleDetails(null);
  }

  showDetails() {
    this.props.setVisibleDetails(this.props.attrs.message_id);
  }

  render() {
    let messageDetails;
    if (this.props.detailsVisible) {
      messageDetails = (
        <div
            className="messaging-message-details"
            ref="messageDetails"
            tabIndex="-1"
            onBlur={this.hideDetails}>
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
        <button onClick={this.showDetails}>
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
    sent_date: React.PropTypes.string.isRequired,
    sender_name: React.PropTypes.string.isRequired,
    recipient_name: React.PropTypes.string.isRequired,
    /* eslint-enable */
  }).isRequired,
  detailsVisible: React.PropTypes.bool,
  setVisibleDetails: React.PropTypes.func
};

export default MessageDetails;
