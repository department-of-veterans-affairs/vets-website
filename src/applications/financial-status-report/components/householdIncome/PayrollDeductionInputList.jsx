import React, { useState } from 'react';
import { useSelector, connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import {
  getJobIndex,
  getJobButton,
  jobButtonConstants,
} from '../../utils/session';
import { BASE_EMPLOYMENT_RECORD } from '../../constants/index';
import { isValidCurrency } from '../../utils/validations';
import ButtonGroup from '../shared/ButtonGroup';

const PayrollDeductionInputList = props => {
  const { goToPath, goBack, setFormData } = props;

  const editIndex = getJobIndex();

  const isEditing = editIndex && !Number.isNaN(editIndex);

  const userType = 'veteran';

  const index = isEditing ? Number(editIndex) : 0;

  const formData = useSelector(state => state.form.data);

  const MAXIMUM_DEDUCTION_AMOUNT = 40000;

  const {
    personalData: {
      employmentHistory: {
        newRecord = {},
        veteran: { employmentRecords = [] },
      },
    },
  } = formData;

  const employmentRecord = isEditing ? employmentRecords[index] : newRecord;

  const { employerName, deductions } = employmentRecord;

  const [selectedDeductions, setSelectedDeductions] = useState(deductions);

  const [errors, setErrors] = useState([]);

  const mapDeductions = target => {
    return selectedDeductions.map(deduction => {
      if (deduction.name === target.name) {
        return {
          ...deduction,
          amount: target.value,
        };
      }
      return deduction;
    });
  };

  const onChange = event => {
    const { target } = event;
    const updatedDeductions = mapDeductions(target);
    setSelectedDeductions(updatedDeductions);
    if (
      !isValidCurrency(target.value) ||
      target.value > MAXIMUM_DEDUCTION_AMOUNT
    ) {
      setErrors([...errors, target.name]);
    } else {
      setErrors(errors.filter(error => error !== target.name));
    }
  };

  const getContinueButtonText = () => {
    if (getJobButton() === jobButtonConstants.FIRST_JOB) {
      return 'Continue';
    }

    if (getJobButton() === jobButtonConstants.EDIT_JOB) {
      return 'Update employment record';
    }
    return 'Add employment record';
  };

  const updateFormData = e => {
    e.preventDefault();

    const errorList = selectedDeductions
      .filter(
        item =>
          !isValidCurrency(item.amount) ||
          item.amount > MAXIMUM_DEDUCTION_AMOUNT,
      )
      .map(item => item.name);

    setErrors(errorList);

    if (errorList.length) return;

    if (isEditing) {
      // find the one we are editing in the employeeRecords array
      const updatedRecords = formData.personalData.employmentHistory.veteran.employmentRecords.map(
        (item, arrayIndex) => {
          return arrayIndex === index
            ? {
                ...employmentRecord,
                deductions: selectedDeductions,
              }
            : item;
        },
      );
      // update form data
      setFormData({
        ...formData,
        personalData: {
          ...formData.personalData,
          employmentHistory: {
            ...formData.personalData.employmentHistory,
            [`${userType}`]: {
              ...formData.personalData.employmentHistory[`${userType}`],
              employmentRecords: updatedRecords,
            },
          },
        },
      });
    } else {
      setFormData({
        ...formData,
        personalData: {
          ...formData.personalData,
          employmentHistory: {
            ...formData.personalData.employmentHistory,
            newRecord: { ...BASE_EMPLOYMENT_RECORD },
            [`${userType}`]: {
              ...formData.personalData.employmentHistory[`${userType}`],
              employmentRecords: [
                { ...employmentRecord, deductions: selectedDeductions },
                ...employmentRecords,
              ],
            },
          },
        },
      });
    }
    goToPath(`/employment-history`);
  };

  const navButtons = (
    <ButtonGroup
      buttons={[
        {
          label: 'Back',
          onClick: goBack, // Define this function based on page-specific logic
          isSecondary: true,
        },
        {
          label: getContinueButtonText(),
          onClick: updateFormData,
          isSubmitting: true, // If this button submits a form
        },
      ]}
    />
  );

  return (
    <form onSubmit={updateFormData}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Your job at {employerName}</h3>
          <p className="vads-u-margin-bottom--neg1 vads-u-margin-top--3 vads-u-padding-bottom--0p25 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base">
            How much do you pay monthly for each of your payroll deductions?
          </p>
        </legend>
        {selectedDeductions?.map((deduction, key) => (
          <div key={deduction.name + key}>
            <va-number-input
              label={deduction.name}
              name={deduction.name}
              value={deduction.amount}
              id={deduction.name + key}
              inputmode="decimal"
              onInput={onChange}
              required
              currency
              width="md"
              min={0}
              max={MAXIMUM_DEDUCTION_AMOUNT}
              error={
                errors.includes(deduction.name)
                  ? 'Please enter a valid dollar amount below $40,000'
                  : null
              }
              uswds
            />
          </div>
        ))}
        <va-additional-info
          trigger="How to calculate your monthly deductions"
          class="vads-u-margin-top--2"
          uswds
        >
          <p>
            First, find the total deduction amount on your pay stub. Then follow
            the step that applies to you:
          </p>
          <ol className="vads-u-margin--0 vads-u-padding-left--4 vads-u-padding-top--2 vads-u-padding-bottom--0p25">
            <li>
              <strong>If you are paid weekly,</strong> multiply your deduction
              amount by 4.
            </li>
            <li>
              <strong>If you are paid every other week,</strong> multiply your
              deduction amount by 26. Then divide the total by 12 to get your
              monthly amount.
            </li>
            <li>
              <strong>If you are paid twice a month,</strong> multiply your
              deduction amount by 2 to get your monthly amount.
            </li>
            <li>
              <strong>If you are paid monthly,</strong> enter the deduction
              amount from your pay stub.
            </li>
          </ol>
        </va-additional-info>
      </fieldset>
      {navButtons}
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
)(PayrollDeductionInputList);

PayrollDeductionInputList.propTypes = {
  goBack: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  onReviewPage: PropTypes.bool,
};
