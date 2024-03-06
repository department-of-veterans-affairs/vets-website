import React, { useState } from 'react';
import { useSelector, connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaNumberInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import {
  getJobIndex,
  getJobButton,
  jobButtonConstants,
} from '../../utils/session';
import { BASE_EMPLOYMENT_RECORD } from '../../constants/index';
import { isValidCurrency } from '../../utils/validations';
import ButtonGroup from '../shared/ButtonGroup';

const SpousePayrollDeductionInputList = props => {
  const { goToPath, goBack, setFormData } = props;

  const editIndex = getJobIndex();

  const isEditing = editIndex && !Number.isNaN(editIndex);

  const userType = 'spouse';

  const index = isEditing ? Number(editIndex) : 0;

  const formData = useSelector(state => state.form.data);

  const MAXIMUM_DEDUCTION_AMOUNT = 40000;

  const {
    personalData: {
      employmentHistory: {
        newRecord = {},
        spouse: { spEmploymentRecords = [] },
      },
    },
  } = formData;

  const employmentRecord = isEditing ? spEmploymentRecords[index] : newRecord;

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
      const updatedRecords = formData.personalData.employmentHistory.spouse.spEmploymentRecords.map(
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
              spEmploymentRecords: updatedRecords,
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
              spEmploymentRecords: [
                { ...employmentRecord, deductions: selectedDeductions },
                ...spEmploymentRecords,
              ],
            },
          },
        },
      });
    }
    goToPath(`/spouse-employment-history`);
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
          <h3 className="vads-u-margin--0">
            Your spouse’s job at {employerName}
          </h3>
          <p className="vads-u-margin-bottom--neg1 vads-u-margin-top--3 vads-u-padding-bottom--0p25 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base">
            How much does your spouse pay monthly for each of their payroll
            deductions?
          </p>
        </legend>
        {selectedDeductions?.map((deduction, key) => (
          <div
            key={deduction.name + key}
            className="vads-u-margin-y--2 input-size-3"
          >
            <VaNumberInput
              label={deduction.name}
              name={deduction.name}
              value={deduction.amount}
              id={deduction.name + key}
              inputmode="decimal"
              onInput={onChange}
              required
              min={0}
              max={MAXIMUM_DEDUCTION_AMOUNT}
              currency
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
          trigger="How to calculate your spouse's monthly deductions"
          class="vads-u-margin-top--2"
          uswds
        >
          <p>
            First, find the total deduction amount on your spouse’s pay stub.
            Then follow the step that applies to your spouse:
          </p>
          <ol className="vads-u-margin--0 vads-u-padding-left--4 vads-u-padding-top--2 vads-u-padding-bottom--0p25">
            <li>
              <strong>If your spouse is paid weekly,</strong> multiply your
              spouse’s deduction amount by 4.
            </li>
            <li>
              <strong>If your spouse is paid every other week,</strong> multiply
              spouse’s your deduction amount by 26. Then divide the total by 12.
            </li>
            <li>
              <strong>If your spouse is paid twice a month,</strong> multiply
              your spouse’s deduction amount by 2.
            </li>
            <li>
              <strong>If your spouse is paid monthly,</strong> enter the
              deduction amount from your spouse’s pay stub.
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
)(SpousePayrollDeductionInputList);

SpousePayrollDeductionInputList.propTypes = {
  goBack: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
};
