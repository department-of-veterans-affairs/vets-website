import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  VaTextInput,
  VaDate,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { parseISODate } from 'platform/forms-system/src/js/helpers';
import { isValidCurrency } from '../utils/validations';

const defaultRecord = [
  {
    purpose: '',
    creditorName: '',
    originalAmount: '',
    unpaidBalance: '',
    amountDueMonthly: '',
    dateStarted: '',
    amountPastDue: '',
  },
];

const InstallmentContract = props => {
  const { data, goToPath, setFormData } = props;

  const { installmentContracts = [] } = data;

  const searchIndex = new URLSearchParams(window.location.search);
  let editIndex = parseInt(searchIndex.get('index'), 10);
  if (Number.isNaN(editIndex)) {
    editIndex = installmentContracts?.length ?? 0;
  }
  const isEditing = !Number.isNaN(editIndex) && editIndex >= 0;

  const index = isEditing ? Number(editIndex) : 0;

  // if we have creditCardBills and plan to edit, we need to get it from the creditCardBills
  const specificRecord = installmentContracts?.length
    ? installmentContracts[index]
    : defaultRecord[0];

  const [contractRecord, setContractRecord] = useState({
    ...(isEditing ? specificRecord : defaultRecord[0]),
  });

  const [purpose, setPurpose] = useState(contractRecord.purpose || null);

  const [creditorName, setCreditorName] = useState(
    contractRecord.creditorName || null,
  );

  const validateLoanBegan = monthYear => {
    if (!monthYear || typeof monthYear !== 'string')
      return 'Please enter a valid date.';

    const [year] = monthYear.split('-');
    const todayYear = new Date().getFullYear();
    const isComplete = /\d{4}-\d{1,2}/.test(monthYear);

    return !(
      !isComplete ||
      (!!year && (parseInt(year, 10) > todayYear || parseInt(year, 10) < 1900))
    );
  };

  const fromDateError = validateLoanBegan(contractRecord.dateStarted)
    ? null
    : 'Please enter the loan start date';

  const { dateStarted } = contractRecord;

  const { month: fromMonth, year: fromYear } = parseISODate(dateStarted);

  const [submitted, setSubmitted] = useState(false);

  const amountDueMonthlyError = !isValidCurrency(
    contractRecord.amountDueMonthly,
  )
    ? 'Please enter the minimum monthly payment amount'
    : null;

  const typeError = !purpose ? 'Please enter the contract type' : null;

  const handleChange = (key, value) => {
    setContractRecord({
      ...contractRecord,
      [key]: value,
    });
  };

  const handlePurposeChange = event => {
    handleChange('purpose', event.target.value);
    setPurpose(event.target.value);
  };

  const handleCreditorNameChange = event => {
    handleChange('creditorName', event.target.value);
    setCreditorName(event.target.value);
  };

  const handleOriginalLoanAmountChange = event => {
    handleChange('originalAmount', event.target.value);
  };

  const handleUnpaidBalanceChange = event => {
    handleChange('unpaidBalance', event.target.value);
  };

  const handleAmountDueMonthlyChange = event => {
    handleChange('amountDueMonthly', event.target.value);
  };

  const handleAmountOverdueChange = event => {
    handleChange('amountPastDue', event.target.value);
  };

  const RETURN_PATH = '/installment-contracts-summary';

  const updateFormData = e => {
    setSubmitted(true);
    e.preventDefault();

    if (fromDateError || typeError || amountDueMonthlyError) {
      return;
    }

    if (contractRecord.purpose && contractRecord.amountDueMonthly) {
      // if amountPastDue is NaN, set it to 0 in order to satisfy va-number-input
      if (!isValidCurrency(contractRecord.amountPastDue)) {
        contractRecord.amountPastDue = 0;
      }

      if (!isValidCurrency(contractRecord.originalAmount)) {
        contractRecord.originalAmount = 0;
      }

      if (!isValidCurrency(contractRecord.unpaidBalance)) {
        contractRecord.unpaidBalance = 0;
      }

      const newInstallmentContractArray = [...installmentContracts];
      newInstallmentContractArray[index] = contractRecord;

      // update form data
      setFormData({
        ...data,
        installmentContracts: newInstallmentContractArray,
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
    handleDateChange: (key, monthYear) => {
      const dateString = `${monthYear}-XX`;
      handleChange(key, dateString);
    },
  };

  return (
    <form onSubmit={updateFormData}>
      <legend className="schemaform-block-title">
        {`${
          installmentContracts.length === index ? 'Add' : 'Update'
        } an installment contract or other debt`}
      </legend>
      <p>
        If you have more than one installment contract or other debt, enter the
        information for one contract or debt below.
      </p>
      <div className="input-size-6">
        <VaTextInput
          className="no-wrap input-size-6"
          error={(submitted && typeError) || null}
          label="Type of contract or debt"
          name="contract-type"
          onInput={handlePurposeChange}
          required
          type="text"
          value={purpose || ''}
        />
      </div>
      <div className="input-size-6">
        <VaTextInput
          className="no-wrap input-size-6"
          label="Name of creditor who holds the contract or debt"
          name="creditor-name"
          onInput={handleCreditorNameChange}
          type="text"
          value={creditorName || ''}
        />
      </div>
      <div className="input-size-4">
        <va-number-input
          hint={null}
          currency
          inputmode="numeric"
          label="Original loan amount"
          name="originalAmount"
          id="originalAmount"
          onInput={handleOriginalLoanAmountChange}
          value={contractRecord.originalAmount}
        />
      </div>
      <div className="input-size-4">
        <va-number-input
          hint={null}
          currency
          inputmode="numeric"
          label="Unpaid balance"
          name="unpaidBalance"
          id="unpaidBalance"
          onInput={handleUnpaidBalanceChange}
          value={contractRecord.unpaidBalance}
        />
      </div>
      <div className="input-size-4">
        <va-number-input
          error={(submitted && amountDueMonthlyError) || null}
          hint={null}
          currency
          required
          inputmode="numeric"
          label="Minimum monthly payment amount"
          name="amountDueMonthly"
          id="amountDueMonthly"
          onInput={handleAmountDueMonthlyChange}
          value={contractRecord.amountDueMonthly}
        />
      </div>
      <div>
        <VaDate
          monthYearOnly
          value={`${fromYear}-${fromMonth}`}
          label="Date the loan began"
          name="loanBegan"
          onDateChange={e =>
            handlers.handleDateChange('dateStarted', e.target.value)
          }
          onDateBlur={e => validateLoanBegan(e.target.value)}
          required={!contractRecord.amountDueMonthly}
          error={(submitted && fromDateError) || null}
        />
      </div>
      <div className="input-size-4">
        <va-number-input
          hint={null}
          currency
          inputmode="numeric"
          label="Amount overdue"
          name="amountPastDue"
          id="amountPastDue"
          onInput={handleAmountOverdueChange}
          value={contractRecord.amountPastDue}
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
          type="submit"
          id="submit"
          className="vads-u-width--auto"
          onClick={handlers.onUpdate}
        >
          {`${
            installmentContracts.length === index ? 'Add' : 'Update'
          } an installment contract`}
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
)(InstallmentContract);
