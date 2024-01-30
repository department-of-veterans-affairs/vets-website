import React from 'react';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

import { NOD_INFO_URL } from '../../shared/constants';

export const showWorkInProgress = ({ title, subTitle }) => (
  <div className="row">
    <div className="usa-width-two-thirds medium-8 columns">
      <FormTitle title={title} subTitle={subTitle} />
      <va-alert status="info" uswds>
        <h2 slot="headline">We’re still working on this feature</h2>
        <p className="vads-u-font-size--base">
          We’re rolling out the Board Appeals (Notice of Disagreement) form in
          stages. It’s not quite ready yet. Please check back again soon.
        </p>
        <p>
          <a
            href={NOD_INFO_URL}
            className="u-vads-display--block u-vads-margin-top--2"
          >
            Return to Board Appeals page
          </a>
        </p>
      </va-alert>
    </div>
  </div>
);
