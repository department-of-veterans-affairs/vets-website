import React from 'react';

import { logout } from 'platform/user/authentication/utilities';
import dashboardManifest from 'applications/personalization/dashboard/manifest';
import recordEvent from 'platform/monitoring/record-event';
import { mhvBaseUrl } from 'platform/site-wide/cta-widget/helpers';

const LEFT_CLICK = 1;
const dashboardLink = dashboardManifest.rootUrl;

class PersonalizationDropdown extends React.Component {
  checkLink = event => {
    const target = event.target;
    if (
      target.tagName.toLowerCase() === 'a' &&
      target.hostname === document.location.hostname &&
      target.pathname === '/' &&
      event.which === LEFT_CLICK
    ) {
      target.href = dashboardLink;
    }
  };

  render() {
    return (
      <ul>
        <li>
          <a
            href="/my-va/"
            onClick={() => {
              recordEvent({
                event: 'nav-user',
                'nav-user-section': 'my-va',
              });
            }}
          >
            My VA
          </a>
        </li>
        <li>
          <a
            href={`${mhvBaseUrl()}/mhv-portal-web/home`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              recordEvent({
                event: 'nav-user',
                'nav-user-section': 'my-health',
              });
            }}
          >
            My Health
          </a>
        </li>
        <li>
          <a
            href="/profile"
            onClick={() => {
              recordEvent({ event: 'nav-user', 'nav-user-section': 'profile' });
            }}
          >
            Profile
          </a>
        </li>
        <li>
          <a
            href="/account"
            onClick={() => {
              recordEvent({ event: 'nav-user', 'nav-user-section': 'account' });
            }}
          >
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
