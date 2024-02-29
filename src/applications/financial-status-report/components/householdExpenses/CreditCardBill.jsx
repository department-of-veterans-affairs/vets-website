import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { isValidCurrency } from '../../utils/validations';
import ButtonGroup from '../shared/ButtonGroup';

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
export const SUMMARY_PATH = '/credit-card-bills-summary';
export const START_PATH = '/credit-card-bills';

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

  const MAXIMUM_BILL_AMOUNT = 100000;

  // if we have creditCardBills and plan to edit, we need to get it from the creditCardBills
  const specificRecord = creditCardBills?.length
    ? creditCardBills[index]
    : defaultRecord[0];

  const [creditCardBillRecord, setCreditCardBillRecord] = useState({
    ...(isEditing ? specificRecord : defaultRecord[0]),
  });

  const [submitted, setSubmitted] = useState(false);

  const unpaidBalanceError =
    !isValidCurrency(creditCardBillRecord.unpaidBalance) ||
    (creditCardBillRecord.unpaidBalance > MAXIMUM_BILL_AMOUNT ||
      creditCardBillRecord.unpaidBalance < 0)
      ? 'Please enter an unpaid balance amount less than $100,000'
      : null;

  const minMonthlyPaymentError =
    !isValidCurrency(creditCardBillRecord.amountDueMonthly) ||
    (creditCardBillRecord.amountDueMonthly > MAXIMUM_BILL_AMOUNT ||
      creditCardBillRecord.amountDueMonthly < 0)
      ? 'Please enter a minimum monthly payment amount less than $100,000'
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

  const updateFormData = e => {
    setSubmitted(true);
    e.preventDefault();

    if (unpaidBalanceError || minMonthlyPaymentError || amountOverdueError) {
      return;
    }

    // Create a copy of the current creditCardBills array
    const newCreditCardBillArray = [...creditCardBills];
    // If it's a new record, set the purpose to 'Credit card payment' explicitly
    if (creditCardBills.length === index) {
      newCreditCardBillArray.push({
        ...defaultRecord[0], // You can include other default values as needed
        ...creditCardBillRecord,
      });
    } else {
      // Update an existing record
      newCreditCardBillArray[index] = creditCardBillRecord;
    }

    if (
      creditCardBillRecord.amountDueMonthly &&
      creditCardBillRecord.unpaidBalance
    ) {
      // if amountPastDue is NaN, set it to 0 in order to satisfy va-number-input
      if (!isValidCurrency(creditCardBillRecord.amountPastDue)) {
        setCreditCardBillRecord(prevRecord => ({
          ...prevRecord,
          amountPastDue: 0,
        }));
      }

      // Update form data
      setFormData({
        ...data,
        expenses: {
          ...data.expenses,
          creditCardBills: newCreditCardBillArray,
        },
      });

      goToPath(SUMMARY_PATH);
    }
  };

  const handlers = {
    onSubmit: event => event.preventDefault(),
    onCancel: event => {
      event.preventDefault();
      if (creditCardBills.length === 0) {
        goToPath(START_PATH);
      } else {
        goToPath(SUMMARY_PATH);
      }
    },
    onUpdate: event => {
      event.preventDefault();
      updateFormData(event);
    },
    onBack: event => {
      event.preventDefault();
      goToPath(SUMMARY_PATH);
    },
  };

  const addCancelButtonsText =
    creditCardBills.length === index ? 'Add' : 'Update';

  const renderAddCancelButtons = () => {
    return (
      <>
        <ButtonGroup
          buttons={[
            {
              label: 'Cancel',
              onClick: handlers.onCancel,
              isSecondary: true,
            },
            {
              label: `${addCancelButtonsText} credit card bill`,
              onClick: handlers.onUpdate,
              isSubmitting: true,
            },
          ]}
        />
      </>
    );
  };

  const renderContinueBackButtons = () => {
    return (
      <>
        <ButtonGroup
          buttons={[
            {
              label: 'Back',
              onClick: handlers.onCancel,
              isSecondary: true,
            },
            {
              label: 'Continue',
              onClick: updateFormData,
              isSubmitting: true,
            },
          ]}
        />
      </>
    );
  };

  return (
    <form onSubmit={updateFormData}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">
            {`${
              creditCardBills.length === index ? 'Add' : 'Update'
            } credit card bill`}
          </h3>
          <p className="vads-u-margin-bottom--neg1 vads-u-margin-top--3 vads-u-padding-bottom--0p25 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base">
            Enter your credit card bill’s information.
          </p>
        </legend>
        <div className="input-size-3 no-wrap">
          <va-number-input
            error={(submitted && unpaidBalanceError) || null}
            hint={null}
            currency
            required
            min={0}
            max={MAXIMUM_BILL_AMOUNT}
            inputmode="numeric"
            label="Unpaid balance"
            name="unpaidBalance"
            id="unpaidBalance"
            onInput={handleUnpaidBalanceChange}
            value={creditCardBillRecord.unpaidBalance}
            uswds
          />
        </div>
        <div className="input-size-3 no-wrap">
          <va-number-input
            error={(submitted && minMonthlyPaymentError) || null}
            hint={null}
            required
            currency
            inputmode="numeric"
            min={0}
            max={MAXIMUM_BILL_AMOUNT}
            label="Minimum monthly payment amount"
            name="amountDueMonthly"
            id="amountDueMonthly"
            onInput={handleMinMonthlyPaymentChange}
            value={creditCardBillRecord.amountDueMonthly}
            uswds
          />
        </div>
        <div className="input-size-3 no-wrap">
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
            uswds
          />
        </div>
        <p>
          {creditCardBills.length > 0
            ? renderAddCancelButtons()
            : renderContinueBackButtons()}
        </p>
      </fieldset>
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

CreditCardBill.propTypes = {
  data: PropTypes.shape({
    expenses: PropTypes.shape({
      creditCardBills: PropTypes.arrayOf(
        PropTypes.shape({
          purpose: PropTypes.string,
          creditorName: PropTypes.string,
          originalAmount: PropTypes.string,
          unpaidBalance: PropTypes.string,
          amountDueMonthly: PropTypes.string,
          dateStarted: PropTypes.string,
          amountPastDue: PropTypes.string,
        }),
      ),
    }),
  }).isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreditCardBill);
