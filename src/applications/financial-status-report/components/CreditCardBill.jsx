import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

const defaultRecord = [
  {
    unpaidBalance: '',
    minMonthlyPayment: '',
    amountOverdue: '',
  },
];

const CreditCardBill = props => {
  const { data, goToPath, goBack, onReviewPage, setFormData } = props;

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
  const specificRecord = creditCardBills
    ? creditCardBills[index]
    : defaultRecord[0];

  const [creditCardBillRecord, setCreditCardBillRecord] = useState({
    ...(isEditing ? specificRecord : defaultRecord[0]),
  });

  const [ccBillIsDirty, setCCBillIsDirty] = useState(false);
  const [unpaidBalanceIsDirty, setUnpaidBalanceIsDirty] = useState(false);
  const [minMonthlyPaymentIsDirty, setMinMonthlyPaymentIsDirty] = useState(
    false,
  );
  const [amountOverdueIsDirty, setAmountOverdueIsDirty] = useState(false);

  const unpaidBalanceError = !creditCardBillRecord.unpaidBalance
    ? 'Please enter the unpaid balance amount'
    : null;

  const minMonthlyPaymentError = !creditCardBillRecord.minMonthlyPayment
    ? 'Please enter the minimum monthly payment amount'
    : null;

  const amountOverdueError = !creditCardBillRecord.amountOverdue
    ? 'Please enter the amount overdue'
    : null;

  const handleChange = (key, value) => {
    setCreditCardBillRecord({
      ...creditCardBillRecord,
      [key]: value,
    });
    setCCBillIsDirty(true);
  };

  const handleUnpaidBalanceChange = event => {
    handleChange('unpaidBalance', event.target.value);
    setUnpaidBalanceIsDirty(true);
  };

  const handleMinMonthlyPaymentChange = event => {
    handleChange('minMonthlyPayment', event.target.value);
    setMinMonthlyPaymentIsDirty(true);
  };

  const handleAmountOverdueChange = event => {
    handleChange('amountOverdue', event.target.value);
    setAmountOverdueIsDirty(true);
  };

  const updateFormData = e => {
    e.preventDefault();
    const newCreditCardBillArray = [...creditCardBills];
    newCreditCardBillArray[index] = creditCardBillRecord;

    if (
      creditCardBillRecord.minMonthlyPayment &&
      creditCardBillRecord.unpaidBalance
    ) {
      // update form data
      setFormData({
        ...data,
        expenses: {
          ...data.expenses,
          creditCardBills: newCreditCardBillArray,
        },
      });

      goToPath('/credit-card-bills-summary');
    }
  };

  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  return (
    <form onSubmit={updateFormData}>
      <legend className="schemaform-block-title">Add a credit card bill</legend>
      <p className="vads-u-padding-top--2">
        Enter your credit card bill’s information.
      </p>

      <div className="input-size-5">
        <va-number-input
          error={
            (ccBillIsDirty && unpaidBalanceIsDirty && unpaidBalanceError) ||
            null
          }
          hint={null}
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
          error={
            (ccBillIsDirty &&
              minMonthlyPaymentIsDirty &&
              minMonthlyPaymentError) ||
            null
          }
          hint={null}
          required
          inputmode="numeric"
          label="Minimum monthly payment amount"
          name="minMonthlyPayment"
          id="minMonthlyPayment"
          onInput={handleMinMonthlyPaymentChange}
          value={creditCardBillRecord.minMonthlyPayment}
        />
      </div>

      <div className="input-size-5">
        <va-number-input
          error={
            (ccBillIsDirty && amountOverdueIsDirty && amountOverdueError) ||
            null
          }
          hint={null}
          inputmode="numeric"
          label="Amount overdue"
          name="amountOverdue"
          id="amountOverdue"
          onInput={handleAmountOverdueChange}
          value={creditCardBillRecord.amountOverdue}
        />
      </div>

      {onReviewPage ? updateButton : navButtons}
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
