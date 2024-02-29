import React, { useState } from 'react';
import { useSelector, connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { payrollDeductionOptions } from '../../constants/checkboxSelections';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { getJobIndex } from '../../utils/session';
import Checklist from '../shared/CheckList';
import { BASE_EMPLOYMENT_RECORD } from '../../constants/index';

const PayrollDeductionChecklist = props => {
  const { goToPath, goBack, setFormData } = props;

  const editIndex = getJobIndex();

  const isEditing = editIndex && !Number.isNaN(editIndex);

  const userType = 'veteran';

  const index = isEditing ? Number(editIndex) : 0;
  const formData = useSelector(state => state.form.data);

  const {
    personalData: {
      employmentHistory: {
        newRecord = {},
        veteran: { employmentRecords = [] },
      },
    },
  } = formData;

  const employmentRecord = isEditing ? employmentRecords[index] : newRecord;

  const { employerName } = employmentRecord;

  const { deductions = [] } = employmentRecord ?? {};

  const [selectedDeductions, setSelectedDeductions] = useState(deductions);

  const isBoxChecked = option => {
    return selectedDeductions.some(incomeValue => incomeValue.name === option);
  };

  const onChange = ({ target }) => {
    const { name, checked } = target;

    if (checked) {
      setSelectedDeductions([...selectedDeductions, { name, amount: '' }]);
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
      const updatedRecords = employmentRecords.map((item, arrayIndex) => {
        return arrayIndex === index
          ? {
              ...employmentRecord,
              deductions: selectedDeductions,
            }
          : item;
      });
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
    } else if (selectedDeductions.length > 0) {
      setFormData({
        ...formData,
        personalData: {
          ...formData.personalData,
          employmentHistory: {
            ...formData.personalData.employmentHistory,
            newRecord: { ...employmentRecord, deductions: selectedDeductions },
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
            newRecord: {
              ...BASE_EMPLOYMENT_RECORD,
            },
            [`${userType}`]: {
              ...formData.personalData.employmentHistory[`${userType}`],
              employmentRecords: [
                {
                  ...employmentRecord,
                  deductions: selectedDeductions,
                },
                ...employmentRecords,
              ],
            },
          },
        },
      });
    }
    if (selectedDeductions.length > 0) {
      goToPath(`/deduction-values`);
    } else {
      goToPath(`/employment-history`);
    }
  };

  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;

  const title = `Your job at ${employerName}`;
  const prompt = 'Which of these payroll deductions do you pay for?';

  return (
    <form onSubmit={updateFormData}>
      <Checklist
        title={title}
        prompt={prompt}
        options={payrollDeductionOptions}
        onChange={event => onChange(event)}
        isBoxChecked={isBoxChecked}
      />
      <va-additional-info trigger="How to find your monthly deductions" uswds>
        <p className="vads-u-padding-bottom--1">
          On your most recent pay stub, find <strong>Deductions</strong>. Select
          the deductions that apply to you.
        </p>
      </va-additional-info>
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
)(PayrollDeductionChecklist);
