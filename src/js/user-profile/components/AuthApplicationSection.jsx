import PropTypes from 'prop-types';
import React from 'react';

class AuthApplicationSection extends React.Component {
  constructor(props) {
    super(props);
    this.handleVerify = this.handleVerify.bind(this);
  }

  handleVerify() {
    window.dataLayer.push({ event: 'verify-link-clicked' });
    const myVerifyUrl = this.props.verifyUrl;
    if (myVerifyUrl) {
      window.dataLayer.push({ event: 'verify-link-opened' });
      const receiver = window.open(`${myVerifyUrl}&op=signin`, '_blank', 'resizable=yes,scrollbars=1,top=50,left=500,width=500,height=750');
      receiver.focus();
    }
  }

  render() {
    let content;

    if (this.props.userProfile.accountType === 3) {
      content = (
        <div className="medium-12 columns">
          <p><span className="label">Your account will allow you to:</span></p>
          <p><a href="/healthcare/apply">Apply for Healthcare</a></p>
          <p><a href="/education/apply-for-education-benefits">Apply for Education Benefits</a></p>
          <p><a href="/healthcare/prescriptions">Refill your prescription</a></p>
          <p><a href="/healthcare/messaging">Message your health care team</a></p>
          <p><a href="/disability-benefits/track-claims">Check your claim status</a></p>
        </div>
      );
    } else {
      content = (
        <div className="medium-12 columns">
          <p><span className="label">Your account will allow you to:</span></p>
          <p><a href="/healthcare/apply">Apply for healthcare</a></p>
          <p><a href="/education/apply-for-education-benefits">Apply for education benefits</a></p>
          <p><span className="label">You need to <a href="#" onClick={this.handleVerify}>verify your account</a> in order to:</span></p>
          <p>Refill your prescription</p>
          <p>Message your health care team</p>
          <p>Check your claim status</p>
        </div>
      );
    }

    return (
      <div className="profile-section medium-12 columns">
        <h4 className="section-header">Available Services</h4>
        {content}
      </div>
    );
  }
}

AuthApplicationSection.propTypes = {
  userProfile: PropTypes.object.isRequired,
  verifyUrl: PropTypes.object.isRequired
};

export default AuthApplicationSection;
