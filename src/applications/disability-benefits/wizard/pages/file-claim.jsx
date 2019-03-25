import React from 'react';
import { pageNames } from './pageList';

const FileClaimPage = () => (
  <div>
    <p>
      <a
        href="/disability/file-disability-claim-form-21-526ez/introduction"
        className="usa-button-primary va-button-primary"
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
