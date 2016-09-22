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

  showDetails(domEvent) {
    domEvent.stopPropagation();
    this.props.setVisibleDetails(this.props.attrs.messageId);
  }

  render() {
    let messageDetails;
    if (this.props.hasVisibleDetails) {
      messageDetails = (
        <div
            className="messaging-message-details"
            ref="messageDetails"
            tabIndex="-1"
            onBlur={this.hideDetails}
            onClick={(domEvent) => domEvent.stopPropagation()}>
          <table>
            <tbody>
              <tr>
                <th>From:</th>
                <td>{this.props.attrs.senderName}</td>
              </tr>
              <tr>
                <th>To:</th>
                <td>{this.props.attrs.recipientName}</td>
              </tr>
              <tr>
                <th>Date:</th>
                <td>{this.props.attrs.sentDate}</td>
              </tr>
              <tr>
                <th>Message ID:</th>
                <td>{this.props.attrs.messageId}</td>
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
    messageId: React.PropTypes.number.isRequired,
    category: React.PropTypes.string.isRequired,
    subject: React.PropTypes.string.isRequired,
    sentDate: React.PropTypes.string.isRequired,
    senderName: React.PropTypes.string.isRequired,
    recipientName: React.PropTypes.string.isRequired,
  }).isRequired,
  hasVisibleDetails: React.PropTypes.bool,
  setVisibleDetails: React.PropTypes.func
};

export default MessageDetails;
