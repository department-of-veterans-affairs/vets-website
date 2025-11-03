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

const ReviewPage = ({ message }) => {
  const navigate = useNavigate();
  const { apptId, claimId } = useParams();

  const address = useSelector(selectVAPResidentialAddress);
  const { data: claimDetails } = useSelector(selectComplexClaim);
  const allExpenses = useSelector(selectAllExpenses);

  // Get the Mileage expense from the expenses
  const mileageExpense =
    allExpenses?.find(exp => exp.expenseType === 'Mileage') || null;

  // Create a grouped version of expenses by expenseType
  const groupedExpenses = (allExpenses ?? []).reduce((acc, expense) => {
    const { expenseType } = expense;
    if (!acc[expenseType]) {
      acc[expenseType] = [];
    }
    acc[expenseType].push(expense);
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
        text="Add more expenses"
        onClick={addMoreExpenses}
      />
      <p>The expenses you’ve added are listed here.</p>
      <va-accordion>
        {Object.entries(groupedExpenses).map(([type, expenses]) => (
          <va-accordion-item key={type} header={`${type} (${expenses.length})`}>
            {expenses.map(expense => (
              <div key={expense.id}>
                <ExpenseCard
                  claimId={claimId}
                  apptId={apptId}
                  expense={expense}
                  address={address}
                />
              </div>
            ))}
          </va-accordion-item>
        ))}
      </va-accordion>
      <va-summary-box>
        <h3 slot="headline">Estimated reimbursement</h3>
        <ul>
          <li>
            <strong>Mileage</strong> ${mileageExpense?.costRequested ?? 0}
          </li>
        </ul>
        <p>
          <strong>Total:</strong> ${claimDetails?.totalCostRequested ?? 0}
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
  claim: PropTypes.arrayOf(PropTypes.object),
  message: PropTypes.shape({
    title: PropTypes.string,
    body: PropTypes.string,
    type: PropTypes.string,
  }),
};

export default ReviewPage;
