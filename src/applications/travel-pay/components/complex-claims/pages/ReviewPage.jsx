import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { selectVAPResidentialAddress } from 'platform/user/selectors';

import ReviewPageAlert from './ReviewPageAlert';
import ExpenseCard from './ExpenseCard';
import {
  selectComplexClaim,
  selectAllExpenses,
} from '../../../redux/selectors';
import {
  getExpenseType,
  formatAmount,
} from '../../../util/complex-claims-helper';
import { EXPENSE_TYPES } from '../../../constants';

const ReviewPage = ({ message }) => {
  const navigate = useNavigate();
  const { apptId, claimId } = useParams();

  const address = useSelector(selectVAPResidentialAddress);
  const { data: claimDetails = {} } = useSelector(selectComplexClaim);
  const allExpenses = useSelector(selectAllExpenses);

  const expenses = allExpenses ?? [];

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
      claimDetails?.documents?.find(doc => doc.documentId === documentId) ||
      null;

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

  const addAnExpense = expenseRoute => {
    // Navigates a user to the add expense page for the type that was passed in
    navigate(`/file-new-claim/${apptId}/${claimId}/${expenseRoute}`);
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
        text="Add more expenses"
        onClick={addMoreExpenses}
      />
      {Object.keys(groupedExpenses).length === 0 && (
        <p>No expenses have been added to this claim.</p>
      )}
      {Object.keys(groupedExpenses).length > 0 && (
        <>
          <p>The expenses you’ve added are listed here.</p>
          <va-accordion>
            {Object.entries(groupedExpenses).map(([type, expensesList]) => {
              const expenseFields = getExpenseType(type);
              return (
                <va-accordion-item
                  key={type}
                  header={`${expenseFields.title} (${expensesList.length})`}
                >
                  {expensesList.map(expense => {
                    return (
                      <ExpenseCard
                        key={expense.id}
                        claimId={claimId}
                        apptId={apptId}
                        expense={expense}
                        address={address}
                      />
                    );
                  })}
                  {/* Only show button when expense type is NOT Mileage */}
                  {type !== 'Mileage' && (
                    <VaButton
                      id={`add-${type.toLowerCase()}-expense-button`}
                      className="vads-u-display--flex vads-u-margin-y--2"
                      text={`Add another ${
                        expenseFields.addButtonText
                      } expense`}
                      secondary
                      onClick={() => addAnExpense(expenseFields.route)}
                    />
                  )}
                </va-accordion-item>
              );
            })}
          </va-accordion>
        </>
      )}

      <va-summary-box>
        <h3 slot="headline">Estimated reimbursement</h3>
        <ul>
          {Object.entries(totalByExpenseType)
            .filter(([_, total]) => total > 0) // only show if total > 0
            .map(([type, total]) => {
              const labelMap = {
                Airtravel: EXPENSE_TYPES.Airtravel.title,
                Commoncarrier: EXPENSE_TYPES.Commoncarrier.title,
                Lodging: EXPENSE_TYPES.Lodging.title,
                Meal: EXPENSE_TYPES.Meal.title,
                Mileage: EXPENSE_TYPES.Mileage.title,
                Parking: EXPENSE_TYPES.Parking.title,
                Other: EXPENSE_TYPES.Other.title,
                Toll: EXPENSE_TYPES.Toll.title,
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
          This estimated reimbursement doesn’t account for the $6 per trip
          deductible.
        </p>
        <va-link
          href="/resources/reimbursed-va-travel-expenses-and-mileage-rate/#monthlydeductible"
          text="Read more about deductibles for VA travel claims"
        />
      </va-summary-box>
      <VaButton
        id="sign-agreement-button"
        className="vads-u-display--flex vads-u-margin-y--2"
        text="Sign agreement"
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
