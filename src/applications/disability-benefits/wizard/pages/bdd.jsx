import React from 'react';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';

// TODO: Add in the dates for 180 and 90 days in the future
const dateFormat = 'MMMM DD, YYYY';
const ninetyDays = moment()
  .add(90, 'd')
  .format(dateFormat);
const oneHundredEightyDays = moment()
  .add(180, 'd')
  .format(dateFormat);

const alertContent = (
  <>
    <p>
      <strong>
        If your separation date is between {ninetyDays} and{' '}
        {oneHundredEightyDays}
      </strong>{' '}
      (90 and 180 days from today), you can file a disability claim through the
      Benefits Delivery at Discharge (BDD) program.
    </p>
    <p>
      <strong>If your separation date is before {ninetyDays},</strong> you can’t
      file a BDD claim, but you can still begin the process of filing your claim
      on eBenefits.
    </p>
    <a
      href="https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation"
      className="usa-button-primary va-button-primary"
    >
      Go to eBenefits
    </a>
    <p>
      <a href="/disability/how-to-file-claim/when-to-file/pre-discharge-claim/">
        Learn more about the BDD program
      </a>
    </p>
  </>
);

const BDDPage = () => (
  <AlertBox
    status="error"
    headline="You’ll need to file a claim on eBenefits"
    content={alertContent}
  />
);

export default {
  name: pageNames.bdd,
  component: BDDPage,
};
