import React, { Component } from 'react';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { focusElement } from 'platform/utilities/ui';

import AccountSecurityContent from './AccountSecurityContent';

// using a class instead of functional component + useEffect hook since we would
// have to do a full mount (vs shallow mount) of the component for tests to
// work, and that would mount the connected DowntimeNotification component,
// which would require mocking the redux store and honestly seems like more
// trouble than it's worth
class AccountSecurity extends Component {
  componentDidMount() {
    focusElement('[data-focus-target]');
  }

  render() {
    return (
      <>
        <h2
          tabIndex="-1"
          className="vads-u-line-height--1  vads-u-margin-y--2 medium-screen:vads-u-margin-y--4"
          data-focus-target
        >
          Account security
        </h2>
        <DowntimeNotification
          appTitle="Account Security"
          dependencies={[externalServices.emis, externalServices.mvi]}
        >
          <AccountSecurityContent />
        </DowntimeNotification>
      </>
    );
  }
}

export default AccountSecurity;
