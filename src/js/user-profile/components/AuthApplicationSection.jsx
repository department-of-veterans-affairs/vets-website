import React from 'react';
import { connect } from 'react-redux';

class AuthApplicationSection extends React.Component {
  render() {
    let content;

    if (this.props.profile.accountType === 3) {
      content = (
        <div className="info-conatiner medium-12 columns">
          <p><span className="label">Your account will allow you to:</span></p>
          <p><a href="/healthcare/apply">Apply for Healthcare</a></p>
          <p><a href="/education/apply-for-education-benefits">Apply for Education Benefits</a></p>
          <p><a href="/healthcare/prescriptions">Refill your prescription</a></p>
          <p><a href="/disability-benefits/track-claims">Check your claim status</a></p>
        </div>
      );
    } else {
      content = (
        <div className="info-conatiner medium-12 columns">
          <p><span className="label">Your account will allow you to:</span></p>
          <p><a href="/healthcare/apply">Apply for Healthcare</a></p>
          <p><a href="/education/apply-for-education-benefits">Apply for Education Benefits</a></p>
          <p><span className="label">You need to <a href="#">verify your account</a> in order to:</span></p>
          <p><a href="/healthcare/prescriptions">Refill your prescription</a></p>
          <p><a href="/disability-benefits/track-claims">Check your claim status</a></p>
        </div>
      );
    }

    return (
      <div className="profile-section medium-12 columns">
        <h4 className="section-header">Authorized Applications</h4>
        {content}
      </div>
    );
  }
}

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(AuthApplicationSection);
export { AuthApplicationSection };
