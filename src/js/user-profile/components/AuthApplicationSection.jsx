import React from 'react';
import { connect } from 'react-redux';

import { handleVerify } from '../../common/helpers/login-helpers.js';

class AuthApplicationSection extends React.Component {
  constructor(props) {
    super(props);
    this.handleVerify = handleVerify;
  }

  render() {
    let content;

    if (this.props.profile.accountType === 3) {
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

// TODO: fill this out
const mapStateToProps = (state) => {
  const userState = state.user;
  return userState;
};

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(AuthApplicationSection);
export { AuthApplicationSection };
