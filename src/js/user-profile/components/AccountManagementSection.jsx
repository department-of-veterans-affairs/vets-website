import React from 'react';
import { connect } from 'react-redux';

class AccountManagementSection extends React.Component {
  render() {
    return (
      <div className="profile-section medium-12 columns">
        <h4 className="section-header">Account Management</h4>
        <div className="button-container medium-4 columns">
          <a href="#">
            <button className="usa-button-outline va-button-warn">Delete Your Account</button>
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
export default connect(mapStateToProps)(AccountManagementSection);
export { AccountManagementSection };
