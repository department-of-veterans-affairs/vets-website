import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  VaTextInput,
  VaDate,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { parseISODate } from 'platform/forms-system/src/js/helpers';
import { isValidCurrency } from '../../utils/validations';
import ContractsExplainer from './ContractsExplainer';
import ButtonGroup from '../shared/ButtonGroup';

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

export const SUMMARY_PATH = '/installment-contracts-summary';
export const START_PATH = '/installment-contracts';

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

  const MAXIMUM_INSTALLMENT_AMOUNT = 1000000;

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

  // if valid returns true, if invalid returns false
  const validateLoanBegan = monthYear => {
    if (!monthYear || typeof monthYear !== 'string') return false;

    const [year] = monthYear.split('-');
    const todayYear = new Date().getFullYear();
    const isComplete = /\d{4}-\d{1,2}/.test(monthYear);

    return !(
      !isComplete ||
      (!!year && (parseInt(year, 10) > todayYear || parseInt(year, 10) < 1900))
    );
  };

  const { dateStarted } = contractRecord;

  const { month: fromMonth, year: fromYear } = parseISODate(dateStarted);

  const [submitted, setSubmitted] = useState(false);
  const [fromDateError, setFromDateError] = useState(null);

  const amountDueMonthlyError =
    !isValidCurrency(contractRecord.amountDueMonthly) ||
    (contractRecord.amountDueMonthly > MAXIMUM_INSTALLMENT_AMOUNT ||
      contractRecord.amountDueMonthly < 0)
      ? 'Please enter a minimum monthly payment amount less than $1,000,000'
      : null;

  const typeError = !purpose ? 'Please enter the contract type' : null;

  const handleChange = (key, value) => {
    setContractRecord(prevRecord => ({
      ...prevRecord,
      [key]: value,
    }));
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

  const updateFormData = e => {
    setSubmitted(true);
    e.preventDefault();

    const loanBeganContainsGoodValue = validateLoanBegan(
      contractRecord.dateStarted,
    );

    if (!loanBeganContainsGoodValue) {
      setFromDateError('Please enter a valid date.');
      return;
    }

    if (typeError || amountDueMonthlyError) {
      return;
    }

    if (contractRecord.purpose && contractRecord.amountDueMonthly) {
      const updatedContractRecord = {
        ...contractRecord,
        amountPastDue: isValidCurrency(contractRecord.amountPastDue)
          ? contractRecord.amountPastDue
          : 0,
        originalAmount: isValidCurrency(contractRecord.originalAmount)
          ? contractRecord.originalAmount
          : 0,
        unpaidBalance: isValidCurrency(contractRecord.unpaidBalance)
          ? contractRecord.unpaidBalance
          : 0,
      };

      const newInstallmentContractArray = [...installmentContracts];
      newInstallmentContractArray[index] = updatedContractRecord;

      // update form data
      setFormData({
        ...data,
        installmentContracts: newInstallmentContractArray,
      });

      goToPath(SUMMARY_PATH);
    }
  };

  const handlers = {
    onSubmit: event => event.preventDefault(),
    onCancel: event => {
      event.preventDefault();
      if (installmentContracts.length === 0) {
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
    handleDateChange: (key, monthYear) => {
      const dateString = `${monthYear}-XX`;
      handleChange(key, dateString);
    },
  };

  const addUpdateButtonsText =
    installmentContracts.length === index ? 'Add' : 'Update';

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
              label: `${addUpdateButtonsText} installment contract`,
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
              installmentContracts.length === index ? 'Add' : 'Update'
            } an installment contract or other debt`}
          </h3>
          <p className="vads-u-margin-bottom--neg1 vads-u-margin-top--3 vads-u-padding-bottom--0p25 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base">
            If you have more than one installment contract or other debt, enter
            the information for one contract or debt below.
          </p>
        </legend>
        <ContractsExplainer />
        <div className="input-size-6">
          <VaTextInput
            className="no-wrap input-size-6"
            id="contractType"
            error={(submitted && typeError) || null}
            label="Type of contract or debt"
            name="contract-type"
            onInput={handlePurposeChange}
            required
            type="text"
            value={purpose || ''}
            uswds
          />
        </div>
        <div className="input-size-6">
          <VaTextInput
            className="no-wrap input-size-6"
            id="creditorName"
            label="Name of creditor who holds the contract or debt"
            name="creditor-name"
            onInput={handleCreditorNameChange}
            type="text"
            value={creditorName || ''}
            uswds
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
            uswds
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
            min={0}
            max={MAXIMUM_INSTALLMENT_AMOUNT}
            onInput={handleUnpaidBalanceChange}
            value={contractRecord.unpaidBalance}
            uswds
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
            min={0}
            max={MAXIMUM_INSTALLMENT_AMOUNT}
            onInput={handleAmountDueMonthlyChange}
            value={contractRecord.amountDueMonthly}
          />
        </div>
        <div>
          <VaDate
            monthYearOnly
            data-testid="loanBegan"
            value={`${fromYear}-${fromMonth}`}
            label="Date the loan began"
            name="loanBegan"
            onDateChange={e =>
              handlers.handleDateChange('dateStarted', e.target.value)
            }
            onDateBlur={e =>
              setFromDateError(
                validateLoanBegan(e.target.value)
                  ? null
                  : 'Please enter a valid date',
              )
            }
            required
            uswds
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
            uswds
          />
        </div>
      </fieldset>
      <div>
        {installmentContracts.length > 0
          ? renderAddCancelButtons()
          : renderContinueBackButtons()}
      </div>
    </form>
  );
};

const mapStateToProps = ({ form }) => {
  return {
    formData: form.data,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
};

InstallmentContract.propTypes = {
  data: PropTypes.shape({
    installmentContracts: PropTypes.array,
  }).isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InstallmentContract);
