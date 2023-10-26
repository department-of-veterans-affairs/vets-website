import React from 'react';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

const HouseholdExpensesExplainerWidget = ({
  data,
  goBack,
  goForward,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        goForward(data);
      }}
    >
      <fieldset>
        <div className="vads-u-margin-top--neg4 vads-u-padding-top--0p25">
          <h3 className="schemaform-block-title">
            Your monthly household expenses
          </h3>
          <p>
            Now we’re going to ask you about your monthly household expenses,
            including:
          </p>
          <ul>
            <li>Housing expenses</li>
            <li>Utility bills</li>
            <li>Installment contracts and other debts</li>
            <li>
              Other living expenses like food, clothing, transportation, child
              care, and health care costs
            </li>
          </ul>
          <va-alert
            class="vads-u-margin-bottom--1"
            close-btn-aria-label="Close notification"
            disable-analytics="false"
            full-width="false"
            show-icon
            status="info"
            visible="true"
          >
            <p className="vads-u-margin--0">
              <strong>
                It’s important for you to include all of your expenses.
              </strong>
            </p>
            <p className="vads-u-margin-bottom--0">
              This helps us understand your situation. We review your income and
              expenses when we assess your ability to repay the debt.
            </p>
          </va-alert>
          {contentBeforeButtons}
          <FormNavButtons
            goBack={goBack}
            goForward={goForward}
            submitToContinue
          />
          {contentAfterButtons}
        </div>
      </fieldset>
    </form>
  );
};

HouseholdExpensesExplainerWidget.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default HouseholdExpensesExplainerWidget;
