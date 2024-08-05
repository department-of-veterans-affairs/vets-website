import React, { useEffect } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';
import {
  EmptyMiniSummaryCard,
  MiniSummaryCard,
} from '../shared/MiniSummaryCard';
import DeleteConfirmationModal from '../shared/DeleteConfirmationModal';
import { useDeleteModal } from '../../hooks/useDeleteModal';
import {
  currency as currencyFormatter,
  firstLetterLowerCase,
  generateUniqueKey,
} from '../../utils/helpers';
import { isStreamlinedLongForm } from '../../utils/streamlinedDepends';
import ButtonGroup from '../shared/ButtonGroup';
import { getMonthlyIncome } from '../../utils/calculateIncome';
import { getMonthlyExpensesAPI } from '../../utils/calculateExpenses';

export const keyFieldsForOtherExpenses = ['name', 'amount'];

const OtherExpensesSummary = ({
  data,
  goToPath,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const {
    gmtData,
    otherExpenses = [],
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;
  // only going back to review if reviewnav and not streamlined
  const returnToReview =
    reviewNavigation && !isStreamlinedLongForm(data) && showReviewNavigation;

  // notify user they are returning to review page if they are in review mode
  const continueButtonText = returnToReview
    ? 'Continue to review page'
    : 'Continue';

  useEffect(() => {
    const calculateExpenses = async () => {
      if (!gmtData?.isEligibleForStreamlined) return;

      try {
        const response = await getMonthlyExpensesAPI(data);

        if (!response)
          throw new Error('No response from getMonthlyExpensesAPI');

        const { calculatedMonthlyExpenses } = response;

        if (!calculatedMonthlyExpenses)
          throw new Error(
            'No value destructured in response from getMonthlyExpensesAPI',
          );

        const { totalMonthlyNetIncome } = getMonthlyIncome(data);
        const calculatedDiscretionaryIncome =
          totalMonthlyNetIncome - calculatedMonthlyExpenses;

        setFormData({
          ...data,
          gmtData: {
            ...gmtData,
            discretionaryBelow:
              calculatedDiscretionaryIncome <
              gmtData?.discretionaryIncomeThreshold,
          },
        });
      } catch (error) {
        Sentry.withScope(scope => {
          scope.setExtra('error', error);
          Sentry.captureMessage(
            `calculate_monthly_expenses failed in OtherExpensesSummary: ${error}`,
          );
        });
      }
    };

    calculateExpenses();
  }, []);

  const onDelete = deleteIndex => {
    const newExpenses = otherExpenses.filter(
      (_, index) => index !== deleteIndex,
    );
    setFormData({
      ...data,
      otherExpenses: newExpenses,
    });
  };

  const {
    isModalOpen,
    handleModalCancel,
    handleModalConfirm,
    handleDeleteClick,
    deleteIndex,
  } = useDeleteModal(onDelete);

  const goBack = () => {
    if (otherExpenses.length === 0) {
      return goToPath('/other-expenses-checklist');
    }
    return goToPath('/other-expenses-values');
  };

  const onSubmit = event => {
    event.preventDefault();
    if (returnToReview) {
      setFormData({
        ...data,
        reviewNavigation: false,
      });
      return goToPath('/review-and-submit');
    }
    return goForward(data);
  };

  const cardBody = text => (
    <p className="vads-u-margin--0">
      Monthly amount: <b>{currencyFormatter(text)}</b>
    </p>
  );
  const emptyPrompt = `Select the 'Add additional living expenses' link to add another living expense. Select the 'Continue' button to proceed to the next question.`;

  return (
    <form onSubmit={onSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend
          id="added-other-living-expenses-summary"
          className="schemaform-block-title"
          name="addedOtherLiviingExpensesSummary"
        >
          <h3 className="vads-u-margin--0">You have added these expenses</h3>
        </legend>
        <div className="vads-l-grid-container--full">
          {!otherExpenses.length ? (
            <EmptyMiniSummaryCard content={emptyPrompt} />
          ) : (
            otherExpenses.map((expense, index) => (
              <MiniSummaryCard
                body={cardBody(expense.amount)}
                editDestination={{
                  pathname: '/add-other-expense',
                  search: `?index=${index}`,
                }}
                heading={expense.name}
                key={generateUniqueKey(
                  expense,
                  keyFieldsForOtherExpenses,
                  index,
                )}
                onDelete={() => handleDeleteClick(index)}
                showDelete
              />
            ))
          )}
          <Link
            className="vads-c-action-link--green"
            to={{
              pathname: '/add-other-expense',
              search: `?index=${otherExpenses.length}`,
            }}
          >
            Add additional living expenses
          </Link>
          {contentBeforeButtons}
          <ButtonGroup
            buttons={[
              {
                label: 'Back',
                onClick: goBack, // Define this function based on page-specific logic
                isSecondary: true,
              },
              {
                label: continueButtonText,
                onClick: onSubmit,
                isSubmitting: 'prevent', // If this button submits a form
              },
            ]}
          />
          {contentAfterButtons}
        </div>
        {isModalOpen ? (
          <DeleteConfirmationModal
            isOpen={isModalOpen}
            onClose={handleModalCancel}
            onDelete={handleModalConfirm}
            modalTitle={firstLetterLowerCase(otherExpenses[deleteIndex]?.name)}
          />
        ) : null}
      </fieldset>
    </form>
  );
};

OtherExpensesSummary.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    otherExpenses: PropTypes.array,
    gmtData: PropTypes.shape({
      isEligibleForStreamlined: PropTypes.bool,
      discretionaryIncomeThreshold: PropTypes.number,
    }),
    reviewNavigation: PropTypes.bool,
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default OtherExpensesSummary;
