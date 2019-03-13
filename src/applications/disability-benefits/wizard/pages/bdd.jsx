import React from 'react';
import { pageNames } from './pageList';

// NOTE: I still need the link to eBenefits
// NOTE: We can add in the dates for 180 and 90 days in the future

const BDDPage = () => (
  <div>
    <p>
      <strong>If your separation date is in the next 180 to 90 days,</strong>{' '}
      you can file a disability claim through the Benefits Delivery at Discharge
      (BDD) program.
    </p>
    <p>
      <strong>If your separation date is less than 90 days away</strong> you
      can’t file a BDD claim, but you can still begin the process of filing your
      claim on eBenefits.
    </p>
    <a href="ebenefits.com" className="usa-button-primary">
      Go to eBenefits
    </a>
    <p>
      <a href="/disability/how-to-file-claim/when-to-file/pre-discharge-claim/">
        Learn more about the BDD program
      </a>
    </p>
  </div>
);

export default {
  name: pageNames.bdd,
  component: BDDPage,
};
