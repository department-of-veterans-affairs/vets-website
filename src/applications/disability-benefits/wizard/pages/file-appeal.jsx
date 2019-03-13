import React from 'react';
import { pageNames } from './pageList';

const FileAppealPage = () => (
  <div>
    <h4>You'll need to file an appeal</h4>
    <p>
      If you disagree with a VA decision on your claim, you can appeal all or
      some of the decision. You have 1 year from the date on your decision to
      file an appeal.
    </p>
    <p>
      <a href="/disability/file-an-appeal">Find out how to file an appeal</a>
    </p>
  </div>
);

export default {
  name: pageNames.fileAppeal,
  component: FileAppealPage,
};
