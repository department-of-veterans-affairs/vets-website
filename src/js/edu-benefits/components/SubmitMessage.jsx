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
          <h5>Claim type</h5>
          <span>{this.props.claimType}</span>
          <h5>Confirmation number</h5>
          <span>{this.props.confirmation}</span>
          <h5>Date receieved</h5>
          <span>{this.props.date}</span>
          <h5>Your claim was sent to</h5>
          <span>{this.props.address}</span>
          <h5>Your claimed benefits</h5>
          <span>{this.props.claimedBenefits}</span>
          <h5>Your relinquished benefits</h5>
          <span>{this.props.relinquishedBenefits}</span>
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
