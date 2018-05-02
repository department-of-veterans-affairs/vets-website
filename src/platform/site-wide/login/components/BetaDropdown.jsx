import React from 'react';

import { logout } from '../../../utilities/authentication';
import dashboardManifest from '../../../../js/personalization/dashboard-beta/manifest.json';

const LEFT_CLICK = 1;
const dashboardLink = dashboardManifest.rootUrl;

function NewBadge() {
  return <span className="usa-label va-label-primary">New</span>;
}

class BetaDropdown extends React.Component {
  componentDidMount() {
    // If when this component is mounted the user is on the index page without the "next" parameter in the URL...
    if (window.location.pathname === '/' && !window.location.search) {
      document.location.href = dashboardLink;
    } else {
      document.addEventListener('click', this.checkLink);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.checkLink);
  }

  checkLink = (event) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'a' && target.pathname === '/' && event.which === LEFT_CLICK) {
      target.href = dashboardLink;
    }
  }

  render() {
    return (
      <ul>
        <li><a href="/profile-beta">Profile</a> <NewBadge/></li>
        <li><a href="/account-beta">Account</a> <NewBadge/></li>
        <li><a href="#" onClick={logout}>Sign Out</a></li>
      </ul>
    );
  }
}

export default BetaDropdown;
