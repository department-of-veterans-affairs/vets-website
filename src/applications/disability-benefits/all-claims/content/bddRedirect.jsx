import React from 'react';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import { EBEN_526_URL, BDD_INFO_URL } from '../../constants';
import { activeServicePeriods } from '../utils';

export default ({ formData }) => {
  const endDates = activeServicePeriods(formData).map(
    sp =>
      sp.dateRange.to ? moment(sp.dateRange.to) : moment().add(200, 'days'),
  );
  const oneEighty = moment().add(180, 'days');
  const ninety = moment().add(90, 'days');

  const headline = 'You’ll need to file your claim on eBenefits';
  const eBenLink = (
    <div style={{ marginBottom: '1em' }}>
      <a className="usa-button-primary va-button-primary" href={EBEN_526_URL}>
        Go to eBenefits
      </a>
    </div>
  );
  const learnMoreLink = (
    <div>
      <a href={BDD_INFO_URL}>Learn more about the BDD program</a>
    </div>
  );
  // Default to > 180 days
  let content = (
    <>
      <p>
        <strong>Your separation date is more than 180 days away</strong>, so you
        won’t be able to file a disability claim. Please check back when you
        have less than 180 days until your separation date.
      </p>
      {learnMoreLink}
    </>
  );

  if (
    endDates.some(
      d => d.isSameOrBefore(oneEighty, 'day') && d.isSameOrAfter(ninety, 'day'),
    )
  ) {
    content = (
      <>
        <p>
          <strong>Your separation date is in the next 90 to 180 days</strong>,
          so you can file a disability claim through the Benefits Delivery at
          Discharge (BDD) program on eBenefits.
        </p>
        {eBenLink}
        {learnMoreLink}
      </>
    );
  } else if (endDates.some(d => d.isBefore(ninety, 'day'))) {
    content = (
      <>
        <p>
          <strong>Your separation date is in less than 90 days</strong>, so you
          won’t be able to file a Benefits Delivery at Discharge (BDD) claim,
          but you can still begin the process of filing your disability claim on
          eBenefits.
        </p>
        {eBenLink}
        {learnMoreLink}
      </>
    );
  }

  return (
    <>
      <p>
        You’re still in the service, so you won’t be able to submit your
        application here on VA.gov.
      </p>
      <AlertBox headline={headline} content={content} status="error" />
    </>
  );
};
