import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';

const alertContent = (
  <>
    <p>
      If you disagree with a VA decision on your claim, you can file a
      Supplemental Claim for all or some of the decisions. This is the only
      decision review option available, as other options needed to be filed
      within a year of the date of the decision letter.
    </p>
    <p>
      <a href="/decision-reviews/supplemental-claim/">
        Find out how to file a Supplemental Claim
      </a>
    </p>
  </>
);

const FileAppealPage = () => (
  <AlertBox
    status="warning"
    headline="You’ll need to file a Supplemental Claim"
    content={alertContent}
  />
);

export default {
  name: pageNames.fileAppeal,
  component: FileAppealPage,
};
