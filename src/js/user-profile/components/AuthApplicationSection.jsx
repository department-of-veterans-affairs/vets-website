import PropTypes from 'prop-types';
import React from 'react';

class AuthApplicationSection extends React.Component {
  render() {
    let content;
    const verifiedAccountType = 3;// verified ID.me accounts are type 3
    const isVerifiedUser = this.props.userProfile.accountType === verifiedAccountType;
    const idCardAvailable = this.props.userProfile.services.indexOf('id-card') !== -1;
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
          {idCardAvailable && <p><a href="/veteran-id-card">Apply for a Veteran ID Card</a></p>}
        </div>
      );
    } else {
      content = (
        <div className="medium-12 columns">
          <p><span className="label">Your account will allow you to:</span></p>
          <p><a href="/health-care/apply">Apply for health care</a></p>
          <p><a href="/education/apply-for-education-benefits">Apply for education benefits</a></p>
          <p><span className="label">You need to <a href="/verify?next=/profile">verify your identity</a> in order to:</span></p>
          <p>Refill your prescription</p>
          <p>Message your health care team</p>
          <p>Get your VA health records</p>
          <p>Check your claim and appeal status</p>
          <p>Check your Post-9/11 GI Bill statement of benefits</p>
          <p>Apply for a Veteran ID Card</p>
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
