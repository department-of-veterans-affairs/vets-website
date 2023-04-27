import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { isValidCurrency } from '../utils/validations';

const defaultRecord = [
  {
    purpose: 'Credit card payment',
    creditorName: '',
    originalAmount: '',
    unpaidBalance: '',
    amountDueMonthly: '',
    dateStarted: '',
    amountPastDue: '',
  },
];

const CreditCardBill = props => {
  const { data, goToPath, setFormData } = props;

  const { expenses } = data;
  const { creditCardBills = [] } = expenses;

  const searchIndex = new URLSearchParams(window.location.search);
  let editIndex = parseInt(searchIndex.get('index'), 10);
  if (Number.isNaN(editIndex)) {
    editIndex = creditCardBills?.length ?? 0;
  }
  const isEditing = editIndex >= 0 && !Number.isNaN(editIndex);

  const index = isEditing ? Number(editIndex) : 0;

  // if we have creditCardBills and plan to edit, we need to get it from the creditCardBills
  const specificRecord = creditCardBills?.length
    ? creditCardBills[index]
    : defaultRecord[0];

  const [creditCardBillRecord, setCreditCardBillRecord] = useState({
    ...(isEditing ? specificRecord : defaultRecord[0]),
  });

  const [submitted, setSubmitted] = useState(false);

  const unpaidBalanceError = !isValidCurrency(
    creditCardBillRecord.unpaidBalance,
  )
    ? 'Please enter the unpaid balance amount'
    : null;

  const minMonthlyPaymentError = !isValidCurrency(
    creditCardBillRecord.amountDueMonthly,
  )
    ? 'Please enter the minimum monthly payment amount'
    : null;

  const amountOverdueError =
    !isValidCurrency(creditCardBillRecord.amountPastDue) &&
    !creditCardBillRecord.amountPastDue === ''
      ? 'Please enter a valid dollar amount'
      : null;

  const handleChange = (key, value) => {
    setCreditCardBillRecord({
      ...creditCardBillRecord,
      [key]: value,
    });
  };

  const handleUnpaidBalanceChange = event => {
    handleChange('unpaidBalance', event.target.value);
  };

  const handleMinMonthlyPaymentChange = event => {
    handleChange('amountDueMonthly', event.target.value);
  };

  const handleAmountOverdueChange = event => {
    handleChange('amountPastDue', event.target.value);
  };

  const RETURN_PATH = '/credit-card-bills-summary';

  const updateFormData = e => {
    setSubmitted(true);
    e.preventDefault();
    const newCreditCardBillArray = [...creditCardBills];
    newCreditCardBillArray[index] = creditCardBillRecord;
    if (
      creditCardBillRecord.amountDueMonthly &&
      creditCardBillRecord.unpaidBalance
    ) {
      // if amountPastDue is NaN, set it to 0 in order to satisfy va-number-input
      if (!isValidCurrency(creditCardBillRecord.amountPastDue)) {
        creditCardBillRecord.amountPastDue = 0;
      }

      // update form data
      setFormData({
        ...data,
        expenses: {
          ...data.expenses,
          creditCardBills: newCreditCardBillArray,
        },
      });

      goToPath(RETURN_PATH);
    }
  };

  const handlers = {
    onSubmit: event => event.preventDefault(),
    onCancel: event => {
      event.preventDefault();
      goToPath(RETURN_PATH);
    },
    onUpdate: event => {
      event.preventDefault();
      updateFormData(event);
    },
    onBack: event => {
      event.preventDefault();
      goToPath(RETURN_PATH);
    },
  };

  return (
    <form onSubmit={updateFormData}>
      <legend className="schemaform-block-title">
        {`${
          creditCardBills.length === index ? 'Add' : 'Update'
        } a credit card bill`}
      </legend>
      <p className="vads-u-padding-top--2">
        Enter your credit card bill’s information.
      </p>
      <div className="input-size-5">
        <va-number-input
          error={(submitted && unpaidBalanceError) || null}
          hint={null}
          currency
          required
          inputmode="numeric"
          label="Unpaid balance"
          name="unpaidBalance"
          id="unpaidBalance"
          onInput={handleUnpaidBalanceChange}
          value={creditCardBillRecord.unpaidBalance}
        />
      </div>
      <div className="input-size-5">
        <va-number-input
          error={(submitted && minMonthlyPaymentError) || null}
          hint={null}
          required
          currency
          inputmode="numeric"
          label="Minimum monthly payment amount"
          name="amountDueMonthly"
          id="amountDueMonthly"
          onInput={handleMinMonthlyPaymentChange}
          value={creditCardBillRecord.amountDueMonthly}
        />
      </div>
      <div className="input-size-5">
        <va-number-input
          error={(submitted && amountOverdueError) || null}
          hint={null}
          currency
          inputmode="numeric"
          label="Amount overdue"
          name="amountPastDue"
          id="amountPastDue"
          onInput={handleAmountOverdueChange}
          value={creditCardBillRecord.amountPastDue}
        />
      </div>
      <p>
        <button
          type="button"
          id="cancel"
          className="usa-button-secondary vads-u-width--auto"
          onClick={handlers.onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          id="submit"
          className="vads-u-width--auto usa-button-primary"
          onClick={handlers.onUpdate}
        >
          {`${
            creditCardBills.length === index ? 'Add' : 'Update'
          } a credit card bill`}
        </button>
      </p>
    </form>
  );
};

const mapStateToProps = ({ form }) => {
  return {
    formData: form.data,
    employmentHistory: form.data.personalData.employmentHistory,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreditCardBill);
