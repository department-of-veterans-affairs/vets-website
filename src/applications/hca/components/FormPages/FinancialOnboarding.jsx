import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

const HouseholdFinancialOnboarding = props => {
  const {
    goBack,
    goForward,
    contentBeforeButtons,
    contentAfterButtons,
  } = props;

  return (
    <>
      <p>
        Next we’ll ask about your household finances. We’ll ask about income and
        expenses for you, your spouse (if you’re married), and any dependents
        you may have.
      </p>

      <h3>How we use your financial information</h3>
      <p>
        When you provide your financial information from the most recent tax
        year, we will verify this information with the IRS. We use this
        information to determine these factors:
      </p>
      <ul>
        <li>If you’re eligible for VA health care based on your income</li>
        <li>If you’re eligible for travel pay reimbursement</li>
        <li>
          If you’ll need to pay a copay for care or prescription medicines
        </li>
      </ul>

      <h3>The financial information you will need</h3>
      <p>
        You will need the following information to fill out this part of the
        application:
      </p>
      <ul>
        <li>
          <strong>
            Last year’s gross and net household income for you, your spouse, and
            your dependents.
          </strong>{' '}
          This includes income from a job and any other sources. Gross income is
          your income before taxes and any other deductions. Net income is your
          income after taxes and deductions.
        </li>
        <li>
          <strong>
            Your deductible expenses for last year. These include certain health
            care and education costs.
          </strong>{' '}
          These expenses will lower the amount of money we count as your income.
        </li>
      </ul>

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
