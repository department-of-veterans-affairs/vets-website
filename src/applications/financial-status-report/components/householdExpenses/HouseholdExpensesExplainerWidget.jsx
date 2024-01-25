import React, { useEffect, useRef } from 'react';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import ReviewPageNavigationAlert from '../alerts/ReviewPageNavigationAlert';

const HouseholdExpensesExplainerWidget = ({
  data,
  goBack,
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const {
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;

  // Always setting focus on the header
  const headerRef = useRef(null);
  useEffect(
    () => {
      if (headerRef?.current) {
        focusElement(headerRef?.current);
      }
    },
    [headerRef],
  );

  const handleBackNavigation = () => {
    if (reviewNavigation && showReviewNavigation) {
      setFormData({
        ...data,
        reviewNavigation: false,
      });
      goToPath('/review-and-submit');
    } else {
      goBack();
    }
  };

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        goForward(data);
      }}
    >
      <fieldset>
        <div className="vads-u-margin-top--neg4 vads-u-padding-top--0p25">
          <h3 className="schemaform-block-title" ref={headerRef}>
            Your monthly household expenses
          </h3>
          {reviewNavigation && showReviewNavigation ? (
            <ReviewPageNavigationAlert data={data} title="household expenses" />
          ) : null}
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
            uswds
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
            goBack={handleBackNavigation}
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
  data: PropTypes.shape({
    reviewNavigation: PropTypes.bool,
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default HouseholdExpensesExplainerWidget;
