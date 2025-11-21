import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import ReviewPageAlert from './ReviewPageAlert';
import ExpensesAccordion from './ExpensesAccordion';
import {
  selectComplexClaim,
  selectAllExpenses,
  selectAllDocuments,
} from '../../../redux/selectors';
import { formatAmount } from '../../../util/complex-claims-helper';
import { EXPENSE_TYPES } from '../../../constants';

const ReviewPage = ({ message }) => {
  const navigate = useNavigate();
  const { apptId, claimId } = useParams();

  const { data: claimDetails = {} } = useSelector(selectComplexClaim);
  const expenses = useSelector(selectAllExpenses) ?? [];
  const documents = useSelector(selectAllDocuments) ?? [];

  // Get total by expense type and return expenses alphabetically
  const totalByExpenseType = Object.fromEntries(
    Object.entries(
      expenses.reduce((acc, expense) => {
        const type = expense.expenseType;
        acc[type] = (acc[type] || 0) + (expense.costRequested || 0);
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

  // For now, we will override the message to have a title, body, and type
  // If message is not provided, use default values
  const overriddenMessage = message || {
    title: '',
    body: 'Your mileage expense was successfully added.',
    type: 'success',
  };

  const [visible, setVisible] = useState(true);
  const onClose = () => setVisible(false);
  const addMoreExpenses = () => {
    navigate(`/file-new-claim/${apptId}/${claimId}/choose-expense`);
  };

  const signAgreement = () => {
    navigate(`/file-new-claim/${apptId}/${claimId}/travel-agreement`);
  };

  return (
    <div data-testid="review-page">
      <h1>Your unsubmitted expenses</h1>
      <ReviewPageAlert
        header={overriddenMessage.title}
        description={overriddenMessage.body}
        status={overriddenMessage.type}
        onCloseEvent={onClose}
        visible={visible}
      />
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

ReviewPage.propTypes = {
  message: PropTypes.shape({
    title: PropTypes.string,
    body: PropTypes.string,
    type: PropTypes.string,
  }),
};

export default ReviewPage;
