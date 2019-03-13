import React from 'react';
import { pageNames } from './index';

const FileClaimPage = () => (
  <div>
    <p>
      <a
        href="/disability/file-disability-claim-form-21-526ez/introduction"
        className="usa-button-primary"
      >
        File a Disability Compensation Claim
      </a>
    </p>
  </div>
);

export default {
  name: pageNames.fileClaim,
  component: FileClaimPage,
};
