import React from 'react';

import { logout } from '../../../user/authentication/utilities';
import dashboardManifest from '../../../../applications/personalization/dashboard/manifest';
import recordEvent from '../../../../platform/monitoring/record-event';
import { mhvBaseUrl } from '../../../../platform/site-wide/cta-widget/helpers';
import isBrandConsolidationEnabled from '../../../../platform/brand-consolidation/feature-flag';

const LEFT_CLICK = 1;
const dashboardLink = dashboardManifest.rootUrl;
const brandConsolidationEnabled = isBrandConsolidationEnabled();

function NewBadge() {
  return <span className="usa-label va-label-primary">New</span>;
}

class PersonalizationDropdown extends React.Component {
  componentDidMount() {
    // remove checkLink function when refactoring out isBrandConsolidationEnabled
    if (!brandConsolidationEnabled) {
      document.addEventListener('click', this.checkLink);
    }
  }

  componentWillUnmount() {
    if (!brandConsolidationEnabled) {
      document.removeEventListener('click', this.checkLink);
    }
  }

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
        {brandConsolidationEnabled && (
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
        )}
        {brandConsolidationEnabled && (
          <li>
            <a
              href={`${mhvBaseUrl()}/mhv-portal-web/home`}
              target="_blank"
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
        )}
        <li>
          <a
            href="/profile"
            onClick={() => {
              recordEvent({ event: 'nav-user', 'nav-user-section': 'profile' });
            }}
          >
            Profile
          </a>
          {!brandConsolidationEnabled && <NewBadge />}
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
          {!brandConsolidationEnabled && <NewBadge />}
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
