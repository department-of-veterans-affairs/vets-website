import React from 'react';
import { connect } from 'react-redux';

class UserDataSection extends React.Component {
  render() {
    return (
      <div className="profile-section medium-12 columns">
        <h4 className="section-header">User Profile</h4>
        <div className="info-conatiner medium-8 columns">
          <p><span className="label medium-4 columns">Member Name:</span>Courtney Eimerman-Wallace</p>
          <p><span className="label medium-4 columns">Sex:</span>Female</p>
          <p><span className="label medium-4 columns">Date of Birth:</span>03/09/1988</p>
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
export default connect(mapStateToProps)(UserDataSection);
export { UserDataSection };
