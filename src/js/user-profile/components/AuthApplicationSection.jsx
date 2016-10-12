import React from 'react';
import { connect } from 'react-redux';

class AuthApplicationSection extends React.Component {
  render() {
    return (
      <div className="profile-section medium-12 columns">
        <h4 className="section-header">Authorized Applications</h4>
        <div className="info-conatiner medium-8 columns">
          <p><span className="label">Your account will allow you to:</span></p>
          <p><a href="#"><i className="success fa fa-check-circle"></i> Apply for Healthcare</a></p>
          <p><a href="#"><i className="success fa fa-check-circle"></i> Apply for Education Benefits</a></p>
          <p><a href="#"><i className="error fa fa-exclamation-triangle"></i> Refill Your Prescription</a></p>
          <p><a href="#"><i className="error fa fa-exclamation-triangle"></i> Check Your Claim Status</a></p>
        </div>
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
