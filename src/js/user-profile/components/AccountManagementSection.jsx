import React from 'react';
import { connect } from 'react-redux';

class AccountManagementSection extends React.Component {
  render() {
    return (
      <div className="profile-section medium-12 columns">
        <h4 className="section-header">Account Management</h4>
        <p><a href="#">Terms and Conditions for Health Tools</a></p>
        <div className="button-container medium-12 columns">
          <a href="https://wallet.id.me/settings" target="_blank" className="warn-exit usa-button-primary usa-button-outline usa-button-outline-exit transparent">
            Delete Your Account
          </a>
        </div>
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
export default connect(mapStateToProps)(AccountManagementSection);
export { AccountManagementSection };
