import React, { Component } from 'react';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { focusElement } from 'platform/utilities/ui';

import { handleDowntimeForSection } from '../alerts/DowntimeBanner';

import AccountSecurityContent from './AccountSecurityContent';

// using a class instead of functional component + useEffect hook since we would
// have to do a full mount (vs shallow mount) of the component for tests to
// work, and that would mount the connected DowntimeNotification component,
// which would require mocking the redux store and honestly seems like more
// trouble than it's worth
class AccountSecurity extends Component {
  componentDidMount() {
    focusElement('[data-focus-target]');
    document.title = `Account Security | Veterans Affairs`;
  }

  render() {
    return (
      <>
        <h2
          tabIndex="-1"
          className="vads-u-margin-y--2 medium-screen:vads-u-margin-bottom--4 medium-screen:vads-u-margin-top--3"
          data-focus-target
        >
          Account security
        </h2>
        <DowntimeNotification
          render={handleDowntimeForSection('account security')}
          dependencies={[externalServices.emis, externalServices.mvi]}
        >
          <AccountSecurityContent />
        </DowntimeNotification>
      </>
    );
  }
}

export default AccountSecurity;
