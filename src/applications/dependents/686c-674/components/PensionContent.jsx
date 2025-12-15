import React from 'react';

/**
 * Renders pension header content
 * @returns {React.ReactElement} Pension header
 */
export function PensionHeader() {
  return (
    <>
      <h3>Your VA Pension Benefits</h3>
      <p>
        A Veterans Pension provides monthly payments to wartime Veterans who
        meet certain age or disability requirements, and whose income and net
        worth is within certain limits.
      </p>
      <p>
        <strong>Note:</strong> A Veterans Pension is different from a military
        retirement pension.
      </p>
    </>
  );
}

/**
 * Pension footer content
 * @returns {React.ReactElement} Pension footer
 */
export function PensionFooter() {
  return (
    <va-additional-info trigger="Why we ask for this information">
      <div>
        We’ll ask you about your net worth and your dependents’ monthly income
        to help us make sure you receive the correct benefit amount.
      </div>
    </va-additional-info>
  );
}

/**
 * Net worth footer content
 * @returns {React.ReactElement} Net worth footer
 */
export function NetWorthFooter() {
  return (
    <va-additional-info trigger="Why we ask for this information">
      <div>
        Providing information about your financial situation helps us make sure
        you receive the correct benefit amount. Depending on the answers you
        provide about your household net worth and your dependents’ income, you
        may need to complete additional forms. After we review your submitted
        form, we’ll notify you by mail if we need more forms.
      </div>
    </va-additional-info>
  );
}
