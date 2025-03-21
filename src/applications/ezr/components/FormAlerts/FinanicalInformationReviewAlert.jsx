import React from 'react';

export const FinancialInformationReviewAlert = () => {
  return (
    <>
      <div className="vads-u-margin-top--4">
        <va-alert slim status="warning" tabIndex={-1} visible>
          <p className="vads-u-margin-y--0 vads-u-font-weight--normal">
            You can review and edit your financial information. Or select{' '}
            <strong>Continue</strong> to go to the next part of this form.
          </p>
        </va-alert>
      </div>
    </>
  );
};
