import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import ExpenseCardList from './ExpenseCardList';
import { getExpenseType } from '../../../util/complex-claims-helper';
import { EXPENSE_TYPES } from '../../../constants';

const ExpensesAccordion = ({
  documents = [],
  expenses = [],
  groupAccordionItemsByType = false,
  headerLevel = 3,
}) => {
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

  const expenseEntries = Object.entries(groupedExpenses);
  const expenseTypeOrder = Object.keys(EXPENSE_TYPES);
  expenseEntries.sort(([a], [b]) => {
    return expenseTypeOrder.indexOf(a) - expenseTypeOrder.indexOf(b);
  });
  const hasExpenses = expenseEntries.length > 0;

  // No expenses case
  if (!hasExpenses) {
    return null;
  }

  return (
    <va-accordion open-single={!groupAccordionItemsByType}>
      {groupAccordionItemsByType ? (
        // Multiple accordion items (one per type)
        // Edit and Delete expense buttons show on the expense card
        // Add expense button is displayed per accordian item (expect for mileage expense types)
        expenseEntries.map(([type, expensesList]) => (
          <va-accordion-item
            key={type}
            header={`${getExpenseType(type).title} (${expensesList.length})`}
            level={headerLevel}
          >
            <ExpenseCardList
              expensesList={expensesList}
              type={type}
              showAddButton
              showEditDelete
            />
          </va-accordion-item>
        ))
      ) : (
        // Single accordion item with grouped sections inside
        // Expense cards are organized by type and each type has a header that is displayed
        <va-accordion-item
          header="Submitted expenses"
          bordered
          level={headerLevel}
        >
          {expenseEntries.map(([type, expensesList]) => (
            <ExpenseCardList
              key={type}
              expensesList={expensesList}
              type={type}
              showHeader
            />
          ))}
        </va-accordion-item>
      )}
    </va-accordion>
  );
};

ExpensesAccordion.propTypes = {
  documents: PropTypes.array,
  expenses: PropTypes.array,
  groupAccordionItemsByType: PropTypes.bool,
  headerLevel: PropTypes.number,
};

export default ExpensesAccordion;
