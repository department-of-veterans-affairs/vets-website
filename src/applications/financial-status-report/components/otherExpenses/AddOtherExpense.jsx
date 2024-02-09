import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  VaTextInput,
  VaNumberInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isValidCurrency } from '../../utils/validations';
import { MAX_OTHER_LIVING_NAME_LENGTH } from '../../constants/checkboxSelections';

const SUMMARY_PATH = '/other-expenses-summary';
const CHECKLIST_PATH = '/other-expenses-checklist';
const MAXIMUM_EXPENSE_AMOUNT = 12000;

const AddOtherExpense = ({ data, goToPath, setFormData }) => {
  const { otherExpenses = [] } = data;

  // Borrowed from 995 AddIssue
  // get index from url '/add-issue?index={index}'
  const searchIndex = new URLSearchParams(window.location.search);
  let index = parseInt(searchIndex.get('index'), 10);
  if (Number.isNaN(index)) {
    index = otherExpenses.length;
  }

  const currentExpense = otherExpenses[index] || {};

  // Expense name data/flags
  const [expenseName, setExpenseName] = useState(currentExpense.name || null);
  const [otherExpenseAmountError, setOtherExpenseAmountError] = useState(null);
  const nameError = !expenseName ? 'Enter valid text' : null;

  // Expense amount data/flags
  const [expenseAmount, setExpenseAmount] = useState(
    currentExpense.amount || null,
  );
  const amountError = !isValidCurrency(expenseAmount)
    ? 'Enter valid amount'
    : null;

  // shared fun
  const [submitted, setSubmitted] = useState(false);

  const handlers = {
    onSubmit: event => {
      // handle page navigation
      // goToPath needs to be encapsulated separately from setFormData
      // or data updates won't be reflected when page navigation occurs
      event.preventDefault();

      if (!nameError && !amountError && !otherExpenseAmountError) {
        goToPath(SUMMARY_PATH);
      }
    },
    onExpenseNameChange: ({ target }) => {
      setExpenseName(target.value);
    },
    onExpenseAmountChange: event => {
      setExpenseAmount(event.target.value);

      if (event.target.value >= MAXIMUM_EXPENSE_AMOUNT) {
        setOtherExpenseAmountError('Amount must be less than $12,000');
      } else {
        setOtherExpenseAmountError(null);
      }
    },
    onCancel: event => {
      event.preventDefault();

      if (otherExpenses.length) {
        return goToPath(SUMMARY_PATH);
      }

      return goToPath(CHECKLIST_PATH);
    },
    onUpdate: () => {
      // handle validation, update form data
      setSubmitted(true);

      // Check for errors
      if (!nameError && !amountError && !otherExpenseAmountError) {
        // Update form data
        const newExpenses = [...otherExpenses];
        // update new or existing index
        newExpenses[index] = {
          name: expenseName,
          amount: expenseAmount,
        };

        setFormData({
          ...data,
          otherExpenses: newExpenses,
        });
      }
    },
  };

  const headerText =
    otherExpenses.length === index
      ? 'Add your additional living expense'
      : 'Update your living expense';

  return (
    <>
      <form onSubmit={handlers.onSubmit}>
        <fieldset className="vads-u-margin-y--2">
          <legend
            id="decision-date-description"
            className="schemaform-block-title"
            name="addOrUpdateExpense"
          >
            {headerText}
          </legend>
          <VaTextInput
            className="no-wrap input-size-3"
            error={(submitted && nameError) || null}
            id="add-other-living-expense-name"
            label="What is the name of the living expense?"
            maxlength={MAX_OTHER_LIVING_NAME_LENGTH}
            name="add-other-living-expense-name"
            onInput={handlers.onExpenseNameChange}
            required
            type="text"
            value={expenseName || ''}
            charcount
          />
          <VaNumberInput
            className="no-wrap input-size-3"
            error={otherExpenseAmountError}
            id="add-other-living-expense-amount"
            inputmode="decimal"
            label="How much do you pay for this expense every month?"
            min={0}
            max={MAXIMUM_EXPENSE_AMOUNT}
            name="add-other-living-expense-amount"
            onInput={handlers.onExpenseAmountChange}
            required
            type="number"
            value={expenseAmount || ''}
          />
          <div className="vads-u-margin-top--2">
            <button
              type="button"
              id="cancel"
              className="usa-button-secondary vads-u-width--auto"
              onClick={handlers.onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit"
              className="vads-u-width--auto"
              onClick={handlers.onUpdate}
            >
              {`${otherExpenses.length === index ? 'Add' : 'Update'} expense`}
            </button>
          </div>
        </fieldset>
      </form>
    </>
  );
};

AddOtherExpense.propTypes = {
  data: PropTypes.shape({
    otherExpenses: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        amount: PropTypes.string,
      }),
    ),
  }),
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default AddOtherExpense;
