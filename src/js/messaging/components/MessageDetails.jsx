import React from 'react';

class MessageDetails extends React.Component {
  constructor(props) {
    super(props);
    this.focusDetails = this.focusDetails.bind(this);
    this.hideDetails = this.hideDetails.bind(this);
  }

  focusDetails(e) {
    if (e.target.checked) {
      this.refs.detailsControl.focus();
    }
  }

  hideDetails(e) {
    this.refs.showDetailsInput.checked = false;
  }

  render() {
    let messageDetails;
    messageDetails = (
      <div className="messaging-message-details">
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

    const inputId = `message-details-${this.props.attrs.messageId}`;

    return (
      <div
          ref="detailsControl"
          className="messaging-message-details-control"
          tabIndex="-1"
          onBlur={this.hideDetails}
          onClick={(e) => e.stopPropagation()}>
        <label htmlFor={inputId}>
          <i className="fa fa-caret-down"></i>
        </label>
        <input
            ref="showDetailsInput"
            id={inputId}
            type="checkbox"
            onChange={this.focusDetails}/>
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
};

export default MessageDetails;
