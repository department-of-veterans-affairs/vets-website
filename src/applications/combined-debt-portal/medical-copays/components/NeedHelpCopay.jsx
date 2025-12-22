import React from 'react';
import { healthResourceCenterPhoneContent } from '../../combined/utils/helpers';

export const NeedHelpCopay = () => (
  <va-need-help data-testid="need-help" class="vads-u-margin-top--4">
    <div slot="content">
      <p>
        Contact us online through{' '}
        <va-link text="Ask VA" href="/contact-us/ask-va" /> or call the VA
        Health Resource Center at {healthResourceCenterPhoneContent()}
      </p>
    </div>
  </va-need-help>
);

export default NeedHelpCopay;
