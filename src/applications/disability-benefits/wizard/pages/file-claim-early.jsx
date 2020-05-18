import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { DISABILITY_526_V2_ROOT_URL } from 'applications/disability-benefits/all-claims/constants';
import { pageNames } from './pageList';

function alertContent() {
  return (
    <>
      <p>
        Based on the information provided, you are ineligible to file a Benefits
        Delivery at Discharge claim. Filing a BDD claim is only available{' '}
        <b>90 to 180</b> days from separation.
      </p>
      <p>However, you can still begin filing an original claim.</p>
      <a
        href={`${DISABILITY_526_V2_ROOT_URL}/introduction`}
        className="usa-button-primary va-button-primary"
      >
        File a disability compensation claim
      </a>
    </>
  );
}

const FileClaimEarlyPage = () => (
  <AlertBox
    status="warning"
    headline="You are ineligible to file a BDD claim"
    content={alertContent()}
  />
);

export default {
  name: pageNames.fileClaimEarly,
  component: FileClaimEarlyPage,
};
