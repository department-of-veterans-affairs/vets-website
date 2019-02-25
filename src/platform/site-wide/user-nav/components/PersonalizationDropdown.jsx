import React from 'react';

import { logout } from 'platform/user/authentication/utilities';
import recordEvent from 'platform/monitoring/record-event';
import { mhvBaseUrl } from 'platform/site-wide/cta-widget/helpers';

const recordNavUserEvent = section => () => {
  recordEvent({ event: 'nav-user', 'nav-user-section': section });
};

const recordMyVaEvent = recordNavUserEvent('my-va');
const recordMyHealthEvent = recordNavUserEvent('my-health');
const recordProfileEvent = recordNavUserEvent('profile');
const recordAccountEvent = recordNavUserEvent('account');

class PersonalizationDropdown extends React.Component {
  render() {
    return (
      <ul>
        <li>
          <a href="/my-va/" onClick={recordMyVaEvent}>
            My VA
          </a>
        </li>
        <li>
          <a
            href={`${mhvBaseUrl()}/mhv-portal-web/home`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={recordMyHealthEvent}
          >
            My Health
          </a>
        </li>
        <li>
          <a href="/profile" onClick={recordProfileEvent}>
            Profile
          </a>
        </li>
        <li>
          <a href="/account" onClick={recordAccountEvent}>
            Account
          </a>
        </li>
        <li>
          <a href="#" onClick={logout}>
            Sign Out
          </a>
        </li>
      </ul>
    );
  }
}

export default PersonalizationDropdown;
