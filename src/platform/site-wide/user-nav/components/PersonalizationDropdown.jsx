import React from 'react';

import { logout } from '../../../user/authentication/utilities';
import dashboardManifest from '../../../../applications/personalization/dashboard/manifest.json';
import recordEvent from '../../../../platform/monitoring/record-event';


const LEFT_CLICK = 1;
const dashboardLink = dashboardManifest.rootUrl;

function NewBadge() {
  return <span className="usa-label va-label-primary">New</span>;
}

class PersonalizationDropdown extends React.Component {
  componentDidMount() {
    document.addEventListener('click', this.checkLink);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.checkLink);
  }

  checkLink = (event) => {
    const target = event.target;
    if (
      target.tagName.toLowerCase() === 'a' &&
      target.hostname === document.location.hostname &&
      target.pathname === '/' &&
      event.which === LEFT_CLICK) {
      target.href = dashboardLink;
    }
  }

  render() {
    return (
      <ul>
        <li><a href="/profile" onClick={() => { recordEvent({ event: 'nav-user', 'nav-user-section': 'profile' });}}>Profile</a> <NewBadge/></li>
        <li><a href="/account" onClick={() => { recordEvent({ event: 'nav-user', 'nav-user-section': 'account' });}}>Account</a> <NewBadge/></li>
        <li><a href="#" onClick={logout}>Sign Out</a></li>
      </ul>
    );
  }
}

export default PersonalizationDropdown;
