import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';


import moment from 'moment';

class UserDataSection extends React.Component {
  render() {
    let content;
    const name = `${this.props.name.first ? this.props.name.first : ''} ${this.props.name.middle ? this.props.name.middle : ''} ${this.props.name.last ? this.props.name.last : ''}`;

    if (this.props.profile.accountType === 3) {
      content = (
        <span>
          <p><span className="label medium-4 columns">Name:</span>{_.startCase(_.toLower(name))}</p>
          <p><span className="label medium-4 columns">Birth Sex:</span>{`${this.props.profile.gender === 'F' ? 'Female' : 'Male'}`}</p>
          <p><span className="label medium-4 columns">Date of Birth:</span>{moment(`${this.props.profile.dob}`).format('MMM D, YYYY')}</p>
        </span>
      );
    }
    return (
      <div className="profile-section medium-12 columns">
        <h4 className="section-header">Account Information</h4>
        <div className="info-conatiner medium-8 columns">
          {content}
          <p><span className="label medium-4 columns">Email Address:</span>{this.props.profile.email} <a href="https://wallet.id.me/settings" target="_blank">Change</a></p>
          <p><span className="label medium-4 columns">Password:</span><a href="https://wallet.id.me/settings" target="_blank">Change</a></p>
        </div>
      </div>
    );
  }
}

// TODO: fill this out
const mapStateToProps = (state) => {
  const userState = state.user;
  return {
    name: userState.profile.userFullName,
    profile: userState.profile
  };
};

// TODO(awong): Remove the pure: false once we start using ImmutableJS.
export default connect(mapStateToProps)(UserDataSection);
export { UserDataSection };
