import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import { selectVAPResidentialAddress } from 'platform/user/selectors';

import ExpenseCard from './ExpenseCard';
import { getExpenseType } from '../../../util/complex-claims-helper';

const ExpensesAccordion = ({
  documents = [],
  expenses = [],
  groupAccordionItemsByType = false,
}) => {
  const navigate = useNavigate();
  const { apptId, claimId } = useParams();
  const address = useSelector(selectVAPResidentialAddress);

  // Group expenses by expenseType and attach their document
  const groupedExpenses = useMemo(
    () => {
      return expenses.reduce((acc, expense) => {
        const { expenseType, documentId } = expense;
        const expenseDocument =
          documents.find(doc => doc.documentId === documentId) || null;
        const expenseWithDocument = { ...expense, document: expenseDocument };

        if (!acc[expenseType]) acc[expenseType] = [];
        acc[expenseType].push(expenseWithDocument);
        return acc;
      }, {});
    },
    [expenses, documents],
  );

  const addAnExpense = expenseRoute => {
    navigate(`/file-new-claim/${apptId}/${claimId}/${expenseRoute}`);
  };
  const expenseEntries = Object.entries(groupedExpenses);
  const hasExpenses = expenseEntries.length > 0;

  // No expenses case
  if (!hasExpenses) {
    return null;
  }

  // Helper to render expenses for a given type
  const renderExpenseGroup = (
    type,
    expensesList,
    showAddButton = true,
    showHeader = false,
    showEditDelete = true,
  ) => {
    const expenseFields = getExpenseType(type);

    return (
      <section key={type} className="vads-u-margin-bottom--3">
        {showHeader && (
          <h2
            data-testid="expense-type-header"
            className=" vads-u-font-size--h3"
          >
            {expenseFields.title}
          </h2>
        )}
        {expensesList.map(expense => (
          <ExpenseCard
            key={expense.id}
            claimId={claimId}
            apptId={apptId}
            expense={expense}
            address={address}
            showEditDelete={showEditDelete}
          />
        ))}

        {showAddButton &&
          type !== 'Mileage' && (
            <VaButton
              id={`add-${type.toLowerCase()}-expense-button`}
              className="vads-u-display--flex vads-u-margin-y--2"
              text={`Add another ${expenseFields.addButtonText} expense`}
              secondary
              onClick={() => addAnExpense(expenseFields.route)}
            />
          )}
      </section>
    );
  };

  return (
    <va-accordion>
      {groupAccordionItemsByType ? (
        // Multiple accordion items (one per type)
        // Edit and Delete expense buttons show on the expense card
        // Add expense button is displayed per accordian item (expect for mileage expense types)
        expenseEntries.map(([type, expensesList]) => (
          <va-accordion-item
            key={type}
            header={`${getExpenseType(type).title} (${expensesList.length})`}
          >
            {renderExpenseGroup(type, expensesList)}
          </va-accordion-item>
        ))
      ) : (
        // Single accordion item with grouped sections inside
        // Expense cards are organized by type and each type has a header that is displayed
        <va-accordion-item header="Submitted expenses" bordered>
          {expenseEntries.map(([type, expensesList]) =>
            renderExpenseGroup(type, expensesList, false, true, false),
          )}
        </va-accordion-item>
      )}
    </va-accordion>
  );
};

ExpensesAccordion.propTypes = {
  documents: PropTypes.array,
  expenses: PropTypes.array,
  groupAccordionItemsByType: PropTypes.bool,
};

export default ExpensesAccordion;
