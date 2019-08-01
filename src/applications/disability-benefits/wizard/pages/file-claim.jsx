import React from 'react';
import { DISABILITY_526_V2_ROOT_URL } from 'applications/disability-benefits/all-claims/constants';
import { pageNames } from './pageList';

const FileClaimPage = () => (
  <div>
    <p>
      <a
        href={`${DISABILITY_526_V2_ROOT_URL}/introduction`}
        className="usa-button-primary va-button-primary"
      >
        File a disability compensation claim
      </a>
    </p>
  </div>
);

export default {
  name: pageNames.fileClaim,
  component: FileClaimPage,
};
