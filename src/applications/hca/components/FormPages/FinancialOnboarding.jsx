import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import EnhancedEligibilityDescription from '../FormDescriptions/EnhancedEligibilityDescription';

const HouseholdFinancialOnboarding = props => {
  const {
    goBack,
    goForward,
    contentBeforeButtons,
    contentAfterButtons,
  } = props;
  const date = new Date();
  const lastYear = date.getFullYear() - 1;

  return (
    <>
      <p>
        Next we’ll ask about your household financial information from{' '}
        {lastYear}. We’ll ask about income and expenses for you, your spouse (if
        you’re married), and any dependents you may have.
      </p>

      <h3 data-testid="hca-custom-page-title">
        How we use your household financial information
      </h3>
      <p>
        It’s your choice whether you want to share your financial information.
        Before you decide, here’s what to know about how we’ll use your
        financial information.
      </p>
      <p className="vads-u-font-weight--bold">
        We use your financial information to determine these factors:
      </p>
      <ul>
        <li>
          <strong>
            If you’re eligible for VA health care based on your income.
          </strong>{' '}
          You may be eligible based on factors other than your income. We call
          these “enhanced eligibility status” factors. If you don’t have one of
          these factors, we’ll use your income to decide if you’re eligible.
        </li>
        <li>
          <strong>If you’re eligible for travel pay reimbursement.</strong>{' '}
          Reimbursement means we pay you back for the cost of travel to and from
          your VA health appointments.
        </li>
        <li>
          <strong>
            If you’ll need to pay a copay for non-service-connected care or
            prescription medicines.
          </strong>{' '}
          This means you may need to pay a fixed amount for some types of care
          or medications you receive from a VA health care provider or an
          approved community care provider.
        </li>
      </ul>

      <p>
        <strong>Note:</strong> We verify the financial information you provide
        with the Internal Revenue Service (IRS).
      </p>

      <EnhancedEligibilityDescription />

      {contentBeforeButtons}
      <FormNavButtons goBack={goBack} goForward={goForward} />
      {contentAfterButtons}
    </>
  );
};

HouseholdFinancialOnboarding.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
};

export default HouseholdFinancialOnboarding;
