import React from 'react';
import { connect } from 'react-redux';

class LoginDataSection extends React.Component {
  render() {
    return (
      <div className="profile-section medium-12 columns">
        <h4 className="section-header">Login Info</h4>
        <div className="info-conatiner medium-8 columns">
          <p><span className="label medium-4 columns">Email Address:</span>{this.props.profile.email}</p>
        </div>
        <div className="button-container medium-4 columns">
          <a href="#">
            <button className="usa-button-outline">Change Your Password</button>
          </a>
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
export default connect(mapStateToProps)(LoginDataSection);
export { LoginDataSection };
