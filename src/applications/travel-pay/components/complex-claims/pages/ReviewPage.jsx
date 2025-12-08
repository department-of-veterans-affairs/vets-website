import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import ReviewPageAlert from './ReviewPageAlert';
import ExpensesAccordion from './ExpensesAccordion';
import {
  selectComplexClaim,
  selectAllExpenses,
  selectAllDocuments,
  selectReviewPageAlert,
} from '../../../redux/selectors';
import { formatAmount } from '../../../util/complex-claims-helper';
import { EXPENSE_TYPES } from '../../../constants';
import { clearReviewPageAlert } from '../../../redux/actions';

const ReviewPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { apptId, claimId } = useParams();

  const { data: claimDetails = {} } = useSelector(selectComplexClaim);
  const expenses = useSelector(selectAllExpenses) ?? [];
  const documents = useSelector(selectAllDocuments) ?? [];
  const alertMessage = useSelector(selectReviewPageAlert);

  const onAlertClose = () => {
    dispatch(clearReviewPageAlert());
  };

  // Get total by expense type and return expenses alphabetically
  const totalByExpenseType = Object.fromEntries(
    Object.entries(
      expenses.reduce((acc, expense) => {
        const { expenseType } = expense;
        acc[expenseType] =
          (acc[expenseType] || 0) + (expense.costRequested || 0);
        return acc;
      }, {}),
    ).sort(([a], [b]) => a.localeCompare(b)),
  );

  // Create a grouped version of expenses by expenseType
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const { expenseType, documentId } = expense;

    // Find document associated with this expense using documentId
    const expenseDocument =
      documents?.find(doc => doc.documentId === documentId) || null;

    // Add document to the expense object
    const expenseWithDocument = {
      ...expense,
      document: expenseDocument,
    };

    if (!acc[expenseType]) {
      acc[expenseType] = [];
    }

    acc[expenseType].push(expenseWithDocument);
    return acc;
  }, {});

  const addMoreExpenses = () => {
    navigate(`/file-new-claim/${apptId}/${claimId}/choose-expense`);
  };

  const signAgreement = () => {
    navigate(`/file-new-claim/${apptId}/${claimId}/travel-agreement`);
  };

  const numGroupedExpenses = Object.keys(groupedExpenses).length;
  const isAlertVisible = !!alertMessage && numGroupedExpenses > 0;

  return (
    <div data-testid="review-page">
      <h1>Your unsubmitted expenses</h1>
      {isAlertVisible && (
        <ReviewPageAlert
          header={alertMessage.title}
          description={alertMessage.description}
          status={alertMessage.type}
          onCloseEvent={onAlertClose}
          visible={isAlertVisible}
        />
      )}
      <VaButton
        id="add-expense-button"
        className="vads-u-display--flex vads-u-margin-y--2"
        text={
          Object.keys(groupedExpenses).length === 0
            ? 'Add expenses'
            : 'Add more expenses'
        }
        secondary
        onClick={addMoreExpenses}
      />
      {Object.keys(groupedExpenses).length === 0 ? (
        <p>No expenses have been added.</p>
      ) : (
        <p>
          Once you’ve added your expenses, submit your claim within 30 days of
          your appointment.
        </p>
      )}
      <ExpensesAccordion
        expenses={expenses}
        documents={documents}
        groupAccordionItemsByType
      />
      <div className="vads-u-margin-top--1">
        <va-card data-testid="summary-box" background>
          <h3 className="vads-u-margin-top--1">Estimated reimbursement</h3>
          <ul>
            {Object.entries(totalByExpenseType)
              .filter(([_, total]) => total > 0) // only show if total > 0
              .map(([type, total]) => {
                const labelMap = {
                  Mileage: EXPENSE_TYPES.Mileage.title,
                  Parking: EXPENSE_TYPES.Parking.title,
                  Toll: EXPENSE_TYPES.Toll.title,
                  Commoncarrier: EXPENSE_TYPES.Commoncarrier.title,
                  Airtravel: EXPENSE_TYPES.Airtravel.title,
                  Lodging: EXPENSE_TYPES.Lodging.title,
                  Meal: EXPENSE_TYPES.Meal.title,
                  Other: EXPENSE_TYPES.Other.title,
                };

                return (
                  <li key={type}>
                    <strong>{labelMap[type] || type}</strong> $
                    {formatAmount(total)}
                  </li>
                );
              })}
          </ul>

          <p>
            <strong>Total:</strong> $
            {formatAmount(claimDetails?.totalCostRequested ?? 0)}
          </p>
          <p>
            Before we can pay you back for expenses, you must pay a deductible.
            The current deductible is $3 one-way or $6 round-trip for each
            appointment, up to $18 total each month.
          </p>
          <va-link
            href="/resources/reimbursed-va-travel-expenses-and-mileage-rate/#monthlydeductible"
            text="Learn more about deductibles for VA travel claims"
            external
          />
        </va-card>
      </div>
      <VaButton
        id="sign-agreement-button"
        className="vads-u-display--flex vads-u-margin-y--2"
        text="Sign agreement"
        continue
        onClick={signAgreement}
      />
    </div>
  );
};

export default ReviewPage;
