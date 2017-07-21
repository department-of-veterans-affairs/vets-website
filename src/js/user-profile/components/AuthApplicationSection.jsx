import PropTypes from 'prop-types';
import React from 'react';

import { handleVerify } from '../../common/helpers/login-helpers.js';

class AuthApplicationSection extends React.Component {
  render() {
    let content;

    if (this.props.userProfile.accountType === 3) {
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
          <p><span className="label">You need to <a href="#" onClick={() => handleVerify(this.props.verifyUrl)}>verify your account</a> in order to:</span></p>
          <p>Refill your prescription</p>
          <p>Message your health care team</p>
          <p>Check your claim status</p>
          <p>Check your Post-9/11 GI Bill statement of benefits</p>
        </div>
      );
    }

    return (
      <div className="profile-section medium-12 columns">
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
