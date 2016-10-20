import React from 'react';
import { connect } from 'react-redux';

import moment from 'moment';

class UserDataSection extends React.Component {
  render() {
    return (
      <div className="profile-section medium-12 columns">
        <h4 className="section-header">User Profile</h4>
        <div className="info-conatiner medium-8 columns">
          <p><span className="label medium-4 columns">Member Name:</span>{this.props.name.first} {this.props.name.middle} {this.props.name.last} {this.props.name.suffix}</p>
          <p><span className="label medium-4 columns">Sex:</span>{`${this.props.profile.gender ? this.props.profile.gender : 'Not Provided'}`}</p>
          <p><span className="label medium-4 columns">Date of Birth:</span>{moment(`${this.props.profile.dob}`).format('MM/DD/YYYY')}</p>
        </div>
      </div>
    );
  }
}

// TODO: fill this out
const mapStateToProps = (state) => {
  return {
    name: state.profile.userFullName,
    profile: state.profile
  };
};

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(UserDataSection);
export { UserDataSection };
