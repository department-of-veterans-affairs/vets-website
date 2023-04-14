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
    contractType: '',
    creditorName: '',
    originalLoanAmount: '',
    unpaidBalance: '',
    amountDueMonthly: '',
    from: '',
    amountOverdue: '',
  },
];

const InstallmentContract = props => {
  const { data, goToPath, setFormData } = props;

  const { expenses } = data;
  const { installmentContracts = [] } = expenses;

  const searchIndex = new URLSearchParams(window.location.search);
  let editIndex = parseInt(searchIndex.get('index'), 10);
  if (Number.isNaN(editIndex)) {
    editIndex = installmentContracts?.length ?? 0;
  }
  const isEditing = editIndex >= 0 && !Number.isNaN(editIndex);

  const index = isEditing ? Number(editIndex) : 0;

  // if we have creditCardBills and plan to edit, we need to get it from the creditCardBills
  const specificRecord = installmentContracts?.length
    ? installmentContracts[index]
    : defaultRecord[0];

  const [contractRecord, setContractRecord] = useState({
    ...(isEditing ? specificRecord : defaultRecord[0]),
  });

  const [contractType, setContractType] = useState(
    contractRecord.contractType || null,
  );

  const [creditorName, setCreditorName] = useState(
    contractRecord.creditorName || null,
  );

  const validateLoanBegan = monthYear => {
    const [year] = monthYear.split('-');
    const todayYear = new Date().getFullYear();
    const isComplete = /\d{4}-\d{1,2}/.test(monthYear);

    return !(
      !isComplete ||
      (!!year && (parseInt(year, 10) > todayYear || parseInt(year, 10) < 1900))
    );
  };

  const fromDateError = validateLoanBegan(contractRecord.from)
    ? null
    : 'Please enter the loan start date';

  const { from } = contractRecord;

  const { month: fromMonth, year: fromYear } = parseISODate(from);

  const [submitted, setSubmitted] = useState(false);

  const amountDueMonthlyError = !isValidCurrency(
    contractRecord.amountDueMonthly,
  )
    ? 'Please enter the minimum monthly payment amount'
    : null;

  const typeError = !contractType ? 'Please enter the contract type' : null;

  const handleChange = (key, value) => {
    setContractRecord({
      ...contractRecord,
      [key]: value,
    });
  };

  const handleContractTypeChange = event => {
    handleChange('contractType', event.target.value);
    setContractType(event.target.value);
  };

  const handleCreditorNameChange = event => {
    handleChange('creditorName', event.target.value);
    setCreditorName(event.target.value);
  };

  const handleOriginalLoanAmountChange = event => {
    handleChange('originalLoanAmount', event.target.value);
  };

  const handleUnpaidBalanceChange = event => {
    handleChange('unpaidBalance', event.target.value);
  };

  const handleAmountDueMonthlyChange = event => {
    handleChange('amountDueMonthly', event.target.value);
  };

  const handleAmountOverdueChange = event => {
    handleChange('amountOverdue', event.target.value);
  };

  const RETURN_PATH = '/installment-contracts-summary';

  const updateFormData = e => {
    setSubmitted(true);
    e.preventDefault();

    if (fromDateError || typeError || amountDueMonthlyError) {
      return;
    }

    if (contractRecord.contractType && contractRecord.amountDueMonthly) {
      // if amountOverdue is NaN, set it to 0 in order to satisfy va-number-input
      if (!isValidCurrency(contractRecord.amountOverdue)) {
        contractRecord.amountOverdue = 0;
      }

      if (!isValidCurrency(contractRecord.originalLoanAmount)) {
        contractRecord.originalLoanAmount = 0;
      }

      if (!isValidCurrency(contractRecord.unpaidBalance)) {
        contractRecord.unpaidBalance = 0;
      }

      const newInstallmentContractArray = [...installmentContracts];
      newInstallmentContractArray[index] = contractRecord;

      // update form data
      setFormData({
        ...data,
        expenses: {
          ...data.expenses,
          installmentContracts: newInstallmentContractArray,
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
      <p className="vads-u-padding-top--2">
        If you have more than one installment contract or other debt, enter the
        information for one contract or debt below.
      </p>
      <div className="input-size-6">
        <VaTextInput
          className="no-wrap input-size-6"
          error={(submitted && typeError) || null}
          label="Type of contract or debt"
          name="contract-type"
          onInput={handleContractTypeChange}
          required
          type="text"
          value={contractType || ''}
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
          name="originalLoanAmount"
          id="originalLoanAmount"
          onInput={handleOriginalLoanAmountChange}
          value={contractRecord.originalLoanAmount}
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
          name="minMonthlyPayment"
          id="minMonthlyPayment"
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
          onDateChange={e => handlers.handleDateChange('from', e.target.value)}
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
          name="amountOverdue"
          id="amountOverdue"
          onInput={handleAmountOverdueChange}
          value={contractRecord.amountOverdue}
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
