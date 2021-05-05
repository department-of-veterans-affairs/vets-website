import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

import { NOD_INFO_URL } from '../constants';

export const showWorkInProgress = ({ title, subTitle }) => (
  <div className="row">
    <div className="usa-width-two-thirds medium-8 columns">
      <FormTitle title={title} subTitle={subTitle} />
      <AlertBox
        status="info"
        headline="We’re still working on this feature"
        content={
          <>
            <p>
              We’re rolling out the Board Appeals (Notice of Disagreement) form
              in stages. It’s not quite ready yet. Please check back again soon.
            </p>
            <p>
              <a
                href={NOD_INFO_URL}
                className="u-vads-display--block u-vads-margin-top--2"
              >
                Return to Board Appeals page
              </a>
            </p>
          </>
        }
      />
    </div>
  </div>
);
