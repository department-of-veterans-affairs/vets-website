import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  EmptyMiniSummaryCard,
  MiniSummaryCard,
} from '../shared/MiniSummaryCard';
import { currency as currencyFormatter } from '../../utils/helpers';

const OtherExpensesSummary = ({
  data,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { otherExpenses = [] } = data;

  const onDelete = deleteIndex => {
    const newExpenses = otherExpenses.filter(
      (source, index) => index !== deleteIndex,
    );

    setFormData({
      ...data,
      otherExpenses: newExpenses,
    });
  };

  const goBack = () => {
    if (otherExpenses.length === 0) {
      return goToPath('/other-expenses-checklist');
    }
    return goToPath('/other-expenses-values');
  };

  const goForward = () => {
    return goToPath('/option-explainer');
  };

  const cardBody = text => (
    <p className="vads-u-margin-y--2 vads-u-color--gray">{text}</p>
  );
  const emptyPrompt = `Select the 'Add additional living expenses' link to add another living expense. Select the 'Continue' button to proceed to the next question.`;

  return (
    <form>
      <fieldset>
        <legend
          id="added-other-living-expenses-summary"
          className="vads-u-font-family--serif"
          name="addedOtherLiviingExpensesSummary"
        >
          You have added these expenses
        </legend>
        <div className="vads-l-grid-container--full">
          {!otherExpenses.length ? (
            <EmptyMiniSummaryCard content={emptyPrompt} />
          ) : (
            otherExpenses.map((expense, index) => (
              <MiniSummaryCard
                body={cardBody(`Value: ${currencyFormatter(expense.amount)}`)}
                editDestination={{
                  pathname: '/add-other-expense',
                  search: `?index=${index}`,
                }}
                heading={expense.name}
                key={expense.name + expense.amount}
                onDelete={() => onDelete(index)}
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

OtherExpensesSummary.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    otherExpenses: PropTypes.array,
  }),
  goBack: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  testingIndex: PropTypes.number,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default OtherExpensesSummary;
