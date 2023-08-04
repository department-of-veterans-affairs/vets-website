import React, { useEffect } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  EmptyMiniSummaryCard,
  MiniSummaryCard,
} from '../shared/MiniSummaryCard';
import { currency as currencyFormatter } from '../../utils/helpers';
import { calculateDiscressionaryIncome } from '../../utils/streamlinedDepends';

const OtherExpensesSummary = ({
  data,
  goToPath,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { gmtData, otherExpenses = [] } = data;

  useEffect(
    () => {
      if (!gmtData?.isElidgibleForStreamlined) return;

      const calculatedDiscressionaryIncome = calculateDiscressionaryIncome(
        data,
      );
      setFormData({
        ...data,
        gmtData: {
          ...gmtData,
          discressionaryBelow:
            calculatedDiscressionaryIncome <
            gmtData?.discressionaryIncomeThreshold,
        },
      });
    },
    // avoiding use of data since it changes so often
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      otherExpenses,
      gmtData?.isElidgibleForStreamlined,
      gmtData?.discressionaryIncomeThreshold,
    ],
  );

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

  const cardBody = text => (
    <p className="vads-u-margin--0">
      Monthly amount: <b>{currencyFormatter(text)}</b>
    </p>
  );
  const emptyPrompt = `Select the 'Add additional living expenses' link to add another living expense. Select the 'Continue' button to proceed to the next question.`;

  return (
    <form>
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
    gmtData: PropTypes.shape({
      isElidgibleForStreamlined: PropTypes.bool,
      discressionaryIncomeThreshold: PropTypes.number,
    }),
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default OtherExpensesSummary;
