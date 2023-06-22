import React, { useState } from 'react';
import { useSelector, connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { getJobIndex } from '../utils/session';
import { BASE_EMPLOYMENT_RECORD } from '../constants/index';

const SpousePayrollDeductionInputList = props => {
  const { goToPath, goBack, onReviewPage, setFormData } = props;

  const editIndex = getJobIndex();

  const isEditing = editIndex && !Number.isNaN(editIndex);

  const userType = 'spouse';

  const index = isEditing ? Number(editIndex) : 0;

  const formData = useSelector(state => state.form.data);

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
  };

  const updateFormData = e => {
    e.preventDefault();
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

  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  return (
    <form onSubmit={updateFormData}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">
            Your spouse’s job at {employerName}
          </h3>
        </legend>
        <p>
          How much does your spouse pay monthly for each of their payroll
          deductions?
        </p>
        {selectedDeductions?.map((deduction, key) => (
          <div
            key={deduction.name + key}
            className="vads-u-margin-y--2 input-size-3"
          >
            <va-number-input
              label={deduction.name}
              name={deduction.name}
              value={deduction.amount}
              id={deduction.name + key}
              inputmode="decimal"
              onInput={onChange}
              required
              currency
            />
          </div>
        ))}
      </fieldset>
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
)(SpousePayrollDeductionInputList);
