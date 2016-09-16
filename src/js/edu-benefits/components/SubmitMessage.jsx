import React from 'react';
import AlertBox from '../../common/components/AlertBox.jsx';

export default class SubmitMessage extends React.Component {
  render() {
    const received = (
      <span>Claim Received!</span>
    );

    const processingTime = (
      <span>
        <b>Average processing time:</b><br/>
        One month
      </span>
    );

    return (
      <div>
        <AlertBox
            content={received}
            isVisible
            status="success"/>
        <AlertBox
            content={processingTime}
            isVisible
            status="warning"/>
        <p>You may be contacted by a claims representative for more information or documents.</p>
        <p>Please print this page for your records.</p>
        <div className="inset">
          <h4>Claim details</h4>
          <hr/>
          <ul className="claim-list">
            <li>
              <b>Claim type</b><br/>
              <span>{this.props.claimType}</span>
            </li>
            <li>
              <b>Claim type</b><br/>
              <span>{this.props.claimType}</span>
            </li>
            <li>
              <b>Confirmation number</b><br/>
              <span>{this.props.confirmation}</span>
            </li>
            <li>
              <b>Date receieved</b><br/>
              <span>{this.props.date}</span>
            </li>
            <li>
              <b>Your claim was sent to</b><br/>
              <span>{this.props.address}</span>
            </li>
            <li>
              <b>Your claimed benefits</b><br/>
              <span>{this.props.claimedBenefits}</span>
            </li>
            <li>
              <b>Your relinquished benefits</b><br/>
              <span>{this.props.relinquishedBenefits}</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

SubmitMessage.propTypes = {
  claimType: React.PropTypes.string.isRequired,
  confirmation: React.PropTypes.string.isRequired,
  date: React.PropTypes.string.isRequired,
  address: React.PropTypes.element.isRequired,
  claimedBenefits: React.PropTypes.string.isRequired,
  relinquishedBenefits: React.PropTypes.string
};
