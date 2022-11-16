import React, { useState } from 'react';
import { useSelector, connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { payrollDeductionOptions } from '../constants/checkboxSelections';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { getJobIndex } from '../utils/session';

const PayrollDeductionChecklist = props => {
  const { goToPath, goBack, onReviewPage, setFormData } = props;

  const editIndex = getJobIndex();

  const isEditing = editIndex && !Number.isNaN(editIndex);

  const userType = 'veteran';

  const index = isEditing ? Number(editIndex) : 0;

  const formData = useSelector(state => state.form.data);
  const employmentRecord =
    formData.personalData.employmentHistory.veteran.employmentRecords[index];

  const { employerName } = employmentRecord;

  const { deductions = [] } = employmentRecord ?? {};

  const [selectedDeductions, setSelectedDeductions] = useState(deductions);

  const isBoxChecked = option => {
    return selectedDeductions.some(incomeValue => incomeValue.name === option);
  };

  const onChange = ({ target }) => {
    const { name, checked } = target;

    if (checked) {
      setSelectedDeductions([...selectedDeductions, { name }]);
    } else {
      setSelectedDeductions(
        selectedDeductions.filter(incomeValue => incomeValue.name !== name),
      );
    }
  };

  const updateFormData = e => {
    e.preventDefault();
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
      // deductions: deductions.filter(source => source.name !== value)
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
      const records = [
        { ...employmentRecord, deductions: selectedDeductions },
        ...formData.personalData.employmentHistory.veteran.employmentRecords.slice(
          1,
        ),
      ];

      setFormData({
        ...formData,
        personalData: {
          ...formData.personalData,
          employmentHistory: {
            ...formData.personalData.employmentHistory,
            [`${userType}`]: {
              ...formData.personalData.employmentHistory[`${userType}`],
              employmentRecords: records,
            },
          },
        },
      });
    }
    goToPath(`/deduction-values`);
  };

  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  return (
    <form onSubmit={updateFormData}>
      <h3 className="vads-u-margin-top--neg1p5">Your job at {employerName}</h3>{' '}
      <br />
      <span className="vads-u-font-size--h4 vads-u-font-family--sans">
        Which of these payroll deductions do you pay for?
      </span>
      <div className="checkbox-list">
        {payrollDeductionOptions?.map((option, key) => (
          <div key={option + key} className="checkbox-list-item">
            <input
              type="checkbox"
              id={option + key}
              name={option}
              value={option}
              checked={isBoxChecked(option)}
              onChange={onChange}
            />
            <label className="vads-u-margin-y--2" htmlFor={option + key}>
              {option}
            </label>
          </div>
        ))}
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
)(PayrollDeductionChecklist);
