import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { focusElement, scrollToTop } from 'platform/utilities/ui';

import useSetPageTitle from '../../../hooks/useSetPageTitle';
import { formatDateTime } from '../../../util/dates';
import { selectAppointment } from '../../../redux/selectors';

const title = 'We’re processing your travel reimbursement claim';

const ConfirmationPage = () => {
  useEffect(() => {
    focusElement('h1');
    scrollToTop('topScrollElement');
  }, []);

  useSetPageTitle(title);

  const { data } = useSelector(selectAppointment);
  const { data: claimData, isSubmitting } = useSelector(
    state => state.travelPay.claimSubmission,
  );

  const [formattedDate, formattedTime] = formatDateTime(data.localStartTime);

  return (
    <div>
      <h1 tabIndex="-1">{title}</h1>
      {isSubmitting && (
        <div className="vads-l-grid-container vads-u-padding-y--3">
          <va-loading-indicator
            label="Loading"
            message="Submitting your claim..."
            data-testid="travel-pay-loading-indicator"
          />
        </div>
      )}
      {claimData && (
        <va-alert status="success" visible>
          <h2 slot="headline">Claim submitted</h2>
          <p className="vads-u-margin-y--0">
            This claim is for your appointment{' '}
            {data.location?.attributes?.name
              ? `at ${data.location.attributes.name}`
              : ''}{' '}
            {data.practitionerName ? `with ${data.practitionerName}` : ''} on{' '}
            {formattedDate} at {formattedTime}.
          </p>
        </va-alert>
      )}
      <h2>What happens next</h2>
      <p className="vads-u-margin-y--2">
        You can check the status of your claim by going to the travel
        reimbursement status page.
      </p>
      <va-link
        href="/my-health/travel-pay/claims/"
        text="Check your travel reimbursement claim status"
      />
      <p className="vads-u-margin-y--2">
        If you’re eligible for reimbursement, we’ll deposit your reimbursement
        in your bank account.
      </p>
      <va-link
        href="/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/"
        text="Learn how to set up direct deposit for travel pay reimbursement"
      />
    </div>
  );
};

export default ConfirmationPage;
