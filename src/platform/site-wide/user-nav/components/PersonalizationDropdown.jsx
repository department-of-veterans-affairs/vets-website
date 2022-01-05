import React from 'react';
import { connect } from 'react-redux';

import { isAuthenticatedWithSSOe } from 'platform/user/authentication/selectors';
import { logout } from 'platform/user/authentication/utilities';
import { mhvUrl } from 'platform/site-wide/mhv/utilities';
import recordEvent from 'platform/monitoring/record-event';

const recordNavUserEvent = section => () => {
  recordEvent({ event: 'nav-user', 'nav-user-section': section });
};

const recordMyVaEvent = recordNavUserEvent('my-va');
const recordMyHealthEvent = recordNavUserEvent('my-health');
const recordProfileEvent = recordNavUserEvent('profile');

export class PersonalizationDropdown extends React.Component {
  signOut = () => {
    // Prevent double clicking of "Sign Out"
    if (!this.signOutDisabled) {
      this.signOutDisabled = true;
      logout();
    }
  };

  render() {
    return (
      <ul>
        <li>
          <a href="/my-va/" onClick={recordMyVaEvent}>
            My VA
          </a>
        </li>
        <li>
          <a href={mhvUrl(true, 'home')} onClick={recordMyHealthEvent}>
            My Health
          </a>
        </li>
        <li>
          <a href={'/profile'} onClick={recordProfileEvent}>
            Profile
          </a>
        </li>

        <li>
          <a href="#" onClick={this.signOut}>
            Sign Out
          </a>
        </li>
      </ul>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
  };
}

export default connect(mapStateToProps)(PersonalizationDropdown);
