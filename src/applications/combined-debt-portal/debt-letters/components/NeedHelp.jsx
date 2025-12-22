import React from 'react';

import { dmcPhoneContent } from '../../combined/utils/helpers';

export const NeedHelp = () => (
  <va-need-help id="needHelp" class="vads-u-margin-top--4">
    <div slot="content">
      <p>
        If you have any questions about your benefit overpayments contact us
        online through <va-link href="https://ask.va.gov/" text="Ask VA" /> or
        call us at {dmcPhoneContent()}
      </p>
    </div>
  </va-need-help>
);

export default NeedHelp;
