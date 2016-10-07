import React from 'react';
import { connect } from 'react-redux';

class UserProfileApp extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="medium-8 small-12">
          <h1>Your Vets.gov Account</h1>
          <p>ACCOUNT TYPE: Blue Member (<a href="#">Want to Upgrade your account?</a>)</p>
          <div className="profile-section medium-12 columns">
            <h4 className="section-header">User Profile</h4>
            <div className="info-conatiner medium-8 columns">
              <p><span className="label medium-4 columns">Member Name:</span> 	Courtney Eimerman-Wallace</p>
              <p><span className="label medium-4 columns">Sex:</span>				Female</p>
              <p><span className="label medium-4 columns">Date of Birth:</span>	03/09/1988</p>
            </div>
            <div className="button-container medium-4 columns">
              <button className="usa-button-outline">This is a Button</button>
            </div>
          </div>
          <div className="profile-section medium-12 columns">
            <h4 className="section-header">Login Info</h4>
            <p><span className="label">Email Address: 	</span> 	crwallace39@gmail.com</p>
          </div>
        </div>
      </div>
    );
  }
}

UserProfileApp.propTypes = {
  children: React.PropTypes.element
};

// TODO: fill this out
const mapStateToProps = (state) => {
  return state;
};

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(UserProfileApp);
export { UserProfileApp };
