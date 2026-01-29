import React, { useEffect, useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { focusElement } from 'platform/utilities/ui/focus';
import useSetPageTitle from '../../../hooks/useSetPageTitle';
import useRecordPageview from '../../../hooks/useRecordPageview';
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
import {
  clearReviewPageAlert,
  setExpenseBackDestination,
} from '../../../redux/actions';
import { ComplexClaimsHelpSection } from '../../HelpText';

const ReviewPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { apptId, claimId } = useParams();
  const alertRef = useRef(null);

  const { data: claimDetails = {} } = useSelector(selectComplexClaim);
  const expenses = useSelector(selectAllExpenses) ?? [];
  const documents = useSelector(selectAllDocuments) ?? [];
  const alertMessage = useSelector(selectReviewPageAlert);

  const title = 'Your unsubmitted expenses';

  useSetPageTitle(title);
  useRecordPageview('complex-claims', title);

  useEffect(
    () => {
      if (alertMessage) {
        if (alertRef.current) {
          focusElement(alertRef.current);
        }
      } else {
        const firstH1 = document.getElementsByTagName('h1')[0];
        if (firstH1) {
          focusElement(firstH1);
        }
      }
    },
    [alertMessage],
  );

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

  const onAlertClose = () => {
    dispatch(clearReviewPageAlert());
  };

  const addMoreExpenses = () => {
    dispatch(setExpenseBackDestination('review'));
    navigate(`/file-new-claim/${apptId}/${claimId}/choose-expense`);
  };

  const signAgreement = () => {
    navigate(`/file-new-claim/${apptId}/${claimId}/travel-agreement`);
  };

  const numGroupedExpenses = Object.keys(groupedExpenses).length;
  const isAlertVisible = !!alertMessage && numGroupedExpenses > 0;

  return (
    <div data-testid="review-page">
      <h1>{title}</h1>
      {isAlertVisible && (
        <ReviewPageAlert
          alertRef={alertRef}
          header={alertMessage.title}
          description={alertMessage.description}
          status={alertMessage.type}
          onCloseEvent={onAlertClose}
          visible={isAlertVisible}
        />
      )}
      <div className="vads-u-display--flex vads-u-justify-content--center mobile-lg:vads-u-justify-content--flex-start vads-u-margin-y--3">
        <VaButton
          id="add-expense-button"
          text={numGroupedExpenses === 0 ? 'Add expenses' : 'Add more expenses'}
          secondary={numGroupedExpenses > 0}
          onClick={addMoreExpenses}
        />
      </div>
      {numGroupedExpenses === 0 ? (
        <>
          <p>
            You haven’t added any expenses. Add at least 1 expense to submit
            your claim.
          </p>
          <ComplexClaimsHelpSection />
        </>
      ) : (
        <>
          <p>
            When you’re done adding expenses, select <b>Sign agreement</b> to
            accept the travel agreement and submit your claim. Make sure to file
            your claim within 30 days of your appointment.
          </p>
          <h2>Expense types</h2>
          <ExpensesAccordion
            expenses={expenses}
            documents={documents}
            groupAccordionItemsByType
            headerLevel={3}
          />
          <div className="vads-u-margin-top--1">
            <va-card data-testid="summary-box" background>
              <h2 className="vads-u-margin-top--1">Estimated reimbursement</h2>
              <ul>
                {Object.entries(totalByExpenseType)
                  .filter(([_, total]) => total > 0) // only show if total > 0
                  .map(([type, total]) => {
                    return (
                      <li key={type}>
                        <strong>{EXPENSE_TYPES[type]?.title ?? type}</strong> $
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
                Before we can pay you back for expenses, you must pay a
                deductible. The current deductible is <strong>$3</strong>{' '}
                one-way or <strong>$6</strong> round-trip for each appointment.
                You’ll pay no more than <strong>$18</strong> total each month.
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
        </>
      )}
    </div>
  );
};

export default ReviewPage;
