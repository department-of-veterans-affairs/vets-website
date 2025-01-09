import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { LAST_YEAR } from '../../utils/constants';

const HouseholdFinancialOnboarding = props => {
  const {
    goBack,
    goForward,
    contentBeforeButtons,
    contentAfterButtons,
  } = props;

  return (
    <>
      <h3 data-testid="hca-custom-page-title">
        Financial information you’ll need
      </h3>
      <p>
        We’ll ask for income information from {LAST_YEAR} for you, your spouse
        (if you’re married), and any dependents you may have.
      </p>

      <p className="vads-u-font-weight--bold">
        Here’s what income information you’ll need to fill out this section:
      </p>

      <ul>
        <li>
          <strong>Gross annual income from work.</strong> Gross income is income
          before taxes and any other deductions. This includes income from a job
          like wages, bonuses, tips, and severance pay.
        </li>
        <li>
          <strong>Net income from a farm, property, or business.</strong> Net
          income is income after taxes and deductions are subtracted.
        </li>
        <li>
          <strong>Other annual income received.</strong> This includes things
          like retirement benefits, unemployment, VA benefit compensation, money
          from the sale of a house, or interest from investments.
        </li>
      </ul>

      <p>
        And we’ll ask for you or your spouse’s deductible expenses from{' '}
        {LAST_YEAR}.
      </p>

      <p className="vads-u-font-weight--bold">
        Here’s what deductible information you can include in this section:
      </p>

      <ul>
        <li>Certain health care or education costs</li>
        <li>Funeral or burial expenses for a spouse or dependent child</li>
      </ul>

      <p>
        These deductible expenses will lower the amount of money we count as
        your income.
      </p>

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
