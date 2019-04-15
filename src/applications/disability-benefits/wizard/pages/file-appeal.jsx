import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';

const alertContent = (
  <>
    <p>
      If you disagree with a VA decision on your claim, you can appeal all or
      some of the decision. To appeal, you can file a Supplemental Claim or a
      Notice of Disagreement.
    </p>
    <p>
      <a href="/disability/file-an-appeal">Find out how to file an appeal</a>
    </p>
  </>
);

const FileAppealPage = () => (
  <AlertBox
    status="warning"
    headline="You’ll need to file an appeal"
    content={alertContent}
  />
);

export default {
  name: pageNames.fileAppeal,
  component: FileAppealPage,
};
