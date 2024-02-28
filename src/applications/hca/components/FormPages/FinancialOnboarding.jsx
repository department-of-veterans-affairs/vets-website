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

      <va-additional-info
        trigger="Learn more about enhanced eligibility status for VA health care"
        uswds
      >
        <div>
          <p className="vads-u-font-weight--bold vads-u-margin-top--0">
            You may qualify for enhanced eligibility status if you receive any
            of these benefits:
          </p>
          <ul>
            <li>VA pension</li>
            <li>A service-connected disability compensation</li>
            <li>Medicaid benefits</li>
          </ul>
          <p className="vads-u-font-weight--bold">
            You may also qualify for enhanced eligibility status if you fit one
            of these descriptions:
          </p>
          <ul className="vads-u-margin-bottom--0">
            <li>You’re a former Prisoner of War (POW)</li>
            <li>You received a Purple Heart</li>
            <li>You received a Medal of Honor</li>
            <li>
              You served in Southwest Asia during the Gulf War between August 2,
              1990, and November 11, 1998
            </li>
            <li>
              You served at least 30 days at Camp Lejeune between August 1,
              1953, and December 31, 1987.
            </li>
            <li>
              You served in a location where you had exposure to Agent Orange
              during the Vietnam War era
            </li>
          </ul>
        </div>
      </va-additional-info>

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
