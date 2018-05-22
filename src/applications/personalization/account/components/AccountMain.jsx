import React from 'react';
import recordEvent from '../../../../platform/monitoring/record-event';

import AccountVerification from './AccountVerification';
import LoginSettings from './LoginSettings';
import MultifactorMessage from './MultifactorMessage';
import TermsAndConditions from './TermsAndConditions';

class AccountMain extends React.Component {
  render() {
    const {
      profile: {
        loa,
        multifactor,
        verified
      },
      terms
    } = this.props;

    return (
      <div>
        <AccountVerification loa={loa}/>
        <MultifactorMessage multifactor={multifactor}/>
        <LoginSettings/>
        <TermsAndConditions terms={terms} verified={verified}/>
        <h4>Have questions about signing in to Vets.gov?</h4>
        <p>
          Get answers to frequently asked questions about how to sign in, common issues with verifying your identity, and your privacy and security on Vets.gov.<br/>
          <a href="/faq" onClick={() => recordEvent({ event: 'account-navigation', 'account-action': 'view-link', 'account-section': 'vets-faqs' })}>Go to Vets.gov FAQs</a>
        </p>
      </div>
    );
  }
}

export default AccountMain;
