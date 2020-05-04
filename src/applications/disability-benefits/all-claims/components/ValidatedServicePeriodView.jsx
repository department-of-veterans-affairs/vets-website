import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { formatReviewDate } from 'platform/forms-system/src/js/helpers';
import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';
import { EBEN_526_PATH } from '../../constants';

export default function ValidatedServicePeriodView({ formData, onEdit }) {
  let from = '';
  let to = '';
  if (formData.dateRange) {
    from = formatReviewDate(formData.dateRange.from);
    to = formatReviewDate(formData.dateRange.to);
  }

  let stillInServiceWarning;

  if (new Date(formData.dateRange.to).getTime() > Date.now()) {
    const alertContent = (
      <>
        <strong>
          Since you're still in the service, you won’t be able to submit your
          application on VA.gov.
        </strong>
        <p>
          If your service history above isn’t correct, you can update your
          information here. Or you can go to eBenefits to file your disability
          claim.
        </p>
        <EbenefitsLink
          path={EBEN_526_PATH}
          className="usa-button-primary va-button-primary"
        >
          Go to eBenefits
        </EbenefitsLink>{' '}
        <p>
          <strong className="vads-u-display--block vads-u-margin-bottom--3">
            OR
          </strong>
          <a onClick={onEdit}>I want to update my service period</a>
        </p>
      </>
    );
    stillInServiceWarning = (
      <>
        <hr />
        <AlertBox
          headline="It looks like you’re still in the service"
          content={alertContent}
          status="error"
        />
      </>
    );
  }

  return (
    <div>
      <strong>{formData.serviceBranch}</strong>
      <br />
      {from} &mdash; {to}
      {stillInServiceWarning}
    </div>
  );
}
