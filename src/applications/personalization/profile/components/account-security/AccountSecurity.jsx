import React, { Component } from 'react';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { focusElement } from 'platform/utilities/ui';

import { handleDowntimeForSection } from '../alerts/DowntimeBanner';
import Headline from '../ProfileSectionHeadline';

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
        <Headline>Account security</Headline>
        <DowntimeNotification
          render={handleDowntimeForSection('account security')}
          dependencies={[externalServices.mvi]}
        >
          <AccountSecurityContent />
        </DowntimeNotification>
      </>
    );
  }
}

export default AccountSecurity;
