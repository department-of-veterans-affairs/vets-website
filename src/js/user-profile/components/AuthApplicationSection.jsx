import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { handleVerify } from '../../common/helpers/login-helpers.js';

import FormList from './FormList';
import { isSIPEnabledForm } from '../helpers';

class AuthApplicationSection extends React.Component {
  verifyUser = () => {
    handleVerify(this.props.verifyUrl);
  }

  handleClick = (formId) => {
    this.props.handleClick(formId, null, true);
  }

  render() {
    let content;
    const verifiedAccountType = 3;// verified ID.me accounts are type 3
    const isVerifiedUser = this.props.userProfile.accountType === verifiedAccountType;
    const savedForms = this.props.userProfile.savedForms;
    const verifiedSavedForms = savedForms.filter(isSIPEnabledForm);
    const hasVerifiedSavedForms = !!verifiedSavedForms.length;

    if (isVerifiedUser) {
      content = (
        <div className="medium-12 columns">
          <p><span className="label">Your account will allow you to:</span></p>
          <p><a href="/health-care/apply">Apply for health care</a></p>
          <p><a href="/education/apply-for-education-benefits">Apply for Education Benefits</a></p>
          <p><a href="/health-care/prescriptions">Refill your prescription</a></p>
          <p><a href="/health-care/messaging">Message your health care team</a></p>
          <p><a href="/health-care/health-records">Get your VA health records</a></p>
          <p><a href="/track-claims">Check your claim and appeal status</a></p>
          <p><a href="/education/gi-bill/post-9-11/ch-33-benefit">Get your Post-9/11 GI Bill statement of benefits</a></p>
        </div>
      );
    } else {
      content = (
        <div className="medium-12 columns">
          <p><span className="label">Your account will allow you to:</span></p>
          <p><a href="/health-care/apply">Apply for health care</a></p>
          <p><a href="/education/apply-for-education-benefits">Apply for education benefits</a></p>
          <p><span className="label">You need to <button className="va-button-link" onClick={this.verifyUser}>verify your account</button> in order to:</span></p>
          <p>Refill your prescription</p>
          <p>Message your health care team</p>
          <p>Check your claim status</p>
          <p>Check your Post-9/11 GI Bill statement of benefits</p>
        </div>
      );
    }

    return (
      <div className="profile-section medium-12 columns">
        {hasVerifiedSavedForms && <FormList handleClick={this.handleClick} savedForms={verifiedSavedForms}/>}
        <h4 className="section-header">Available services</h4>
        {content}
      </div>
    );
  }
}

AuthApplicationSection.propTypes = {
  userProfile: PropTypes.object.isRequired,
  verifyUrl: PropTypes.string
};

export default AuthApplicationSection;
