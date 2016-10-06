import React from 'react';
import moment from 'moment';

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
        <br/>
        <AlertBox
            content={processingTime}
            isVisible
            status="warning"/>
        <p>A claims representative may contact you for more information or documents.</p>
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
              <b>Confirmation number</b><br/>
              <span>{this.props.confirmation}</span>
            </li>
            <li>
              <b>Date receieved</b><br/>
              <span>{moment(this.props.date).format('MMM M, YYYY')}</span>
            </li>
            <li>
              <b>Your claim was sent to</b><br/>
              <address className="edu-benefits-pre">{this.props.address}</address>
            </li>
            <li>
              <b>Your claimed benefits</b><br/>
              {this.props.claimedBenefits.map((benefit, index) => <span key={index}>{index === 0 ? null : <br/>}{benefit}</span>)}
            </li>
            <li>
              <b>Benefits you gave up</b><br/>
              <span>{this.props.relinquishedBenefits}</span>
            </li>
          </ul>
        </div>
        <h4>Documents</h4>
        <p>This form doesn’t currently allow you to upload documents. Nothing is required right now. VA will review your application.</p>
        <p><b>VA may eventually need the following documents:</b></p>
        <ul>
          <li>Your Reserve Kicker (if applicable)</li>
          <li>Documentation of contributions to increase the amount of your monthly benefits. (if applicable)</li>
        </ul>
        <p>You can upload these documents, if you have them, through the <a href="https://gibill.custhelp.com/app/utils/login_form/redirect/account%252">GI Bill site.</a></p>
        <p>Need help? If you have questions, call 1-888-442-4551 (1-888-GI-Bill)</p>
      </div>
    );
  }
}

SubmitMessage.propTypes = {
  claimType: React.PropTypes.string.isRequired,
  confirmation: React.PropTypes.string.isRequired,
  date: React.PropTypes.string.isRequired,
  address: React.PropTypes.string.isRequired,
  claimedBenefits: React.PropTypes.string.isRequired,
  relinquishedBenefits: React.PropTypes.string
};
