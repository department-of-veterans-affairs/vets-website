import React from 'react';
import moment from 'moment';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';
import { EBEN_526_PATH, BDD_INFO_URL } from '../../constants';
import { activeServicePeriods } from '../utils';

export default ({ formData }) => {
  const endDates = activeServicePeriods(formData).map(
    sp =>
      sp.dateRange.to ? moment(sp.dateRange.to) : moment().add(200, 'days'),
  );
  const oneEighty = moment().add(180, 'days');
  const ninety = moment().add(90, 'days');

  let headline = 'You’ll need to file your claim on eBenefits';
  let content;
  const eBenLink = (
    <div style={{ marginBottom: '1em' }}>
      <EbenefitsLink
        path={EBEN_526_PATH}
        className="usa-button-primary va-button-primary"
      >
        Go to eBenefits
      </EbenefitsLink>
    </div>
  );
  const learnMoreLink = (
    <div>
      <a href={BDD_INFO_URL}>Learn more about the BDD program</a>
    </div>
  );
  let preAlertContent = (
    <p>
      You’re still in the service, so you won’t be able to submit your
      application here on VA.gov.
    </p>
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
  } else {
    headline = 'You can’t file a disability claim right now';
    preAlertContent = null;
    content = (
      <>
        <p>
          <strong>
            You can’t file a disability claim until 180 days before you leave
            the service.
          </strong>{' '}
          Please check back when your separation date is less than 180 days
          away.
        </p>
        <p>
          In the meantime, you can begin to gather any supporting documents or
          evidence you’ll submit for your claim.
        </p>
      </>
    );
  }

  return (
    <>
      {preAlertContent}
      <AlertBox headline={headline} content={content} status="error" />
    </>
  );
};
