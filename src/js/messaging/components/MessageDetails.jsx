import React from 'react';
import moment from 'moment';

class MessageDetails extends React.Component {
  constructor(props) {
    super(props);
    this.focusDetails = this.focusDetails.bind(this);
    this.hideDetails = this.hideDetails.bind(this);
  }

  focusDetails(domEvent) {
    // This event only results from from the regular trigger.
    // If it's being used, the compact trigger should not be
    // visible, so it should be safe to turn it off.
    this.refs.compactDetailsTrigger.checked = false;

    if (domEvent.target.checked) {
      // Focus the control so that it can hide the details on blur.
      this.refs.detailsControl.focus();
    }
  }

  hideDetails() {
    this.refs.detailsTrigger.checked = false;
  }

  render() {
    const messageDetails = (
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
              <td>
                {
                  moment(
                    this.props.attrs.sentDate
                  ).format('MMMM DD[,] YYYY[,] HH[:]mm zz')
                }
              </td>
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
    const compactInputId = `compact-${inputId}`;

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
            ref="detailsTrigger"
            id={inputId}
            type="checkbox"
            onChange={this.focusDetails}/>
        <input
            ref="compactDetailsTrigger"
            id={compactInputId}
            className="messaging-compact-details-trigger"
            type="checkbox"/>
        <span>
          {
            moment(
              this.props.attrs.sentDate
            ).format('MMMM DD[,] YYYY[,] HH[:]mm zz')
          }
        </span>
        <label htmlFor={compactInputId}></label>
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
