import React, { useEffect } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
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
import { calculateDiscretionaryIncome } from '../../utils/streamlinedDepends';

export const keyFieldsForOtherExpenses = ['name', 'amount'];

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
      if (!gmtData?.isEligibleForStreamlined) return;

      const calculatedDiscretionaryIncome = calculateDiscretionaryIncome(data);
      setFormData({
        ...data,
        gmtData: {
          ...gmtData,
          discretionaryBelow:
            calculatedDiscretionaryIncome <
            gmtData?.discretionaryIncomeThreshold,
        },
      });
    },
    // avoiding use of data since it changes so often
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      otherExpenses,
      gmtData?.isEligibleForStreamlined,
      gmtData?.discretionaryIncomeThreshold,
    ],
  );

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
          <FormNavButtons goBack={goBack} goForward={goForward} />
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
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default OtherExpensesSummary;
