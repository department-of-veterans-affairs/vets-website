import React from 'react';

const FinancialInformationReviewWarning = () => {
  const isReviewPage = window?.location?.pathname.includes('review-and-submit');
  return (
    !isReviewPage && (
      <va-alert
        status="warning"
        class="vads-u-margin-top--4"
        tabIndex={-1}
        slim
      >
        You can review and edit your financial information. Or select{' '}
        <strong>Continue</strong> to go to the next part of this form.
      </va-alert>
    )
  );
};

export default FinancialInformationReviewWarning;
