import React, { useState } from 'react';
import { useSelector, connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { payrollDeductionOptions } from '../../constants/checkboxSelections';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { getJobIndex } from '../../utils/session';
import Checklist from '../shared/CheckList';
import { BASE_EMPLOYMENT_RECORD } from '../../constants/index';

const PayrollDeductionChecklist = props => {
  const { goToPath, goBack, onReviewPage, setFormData } = props;

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
  const updateButton = <button type="submit">Review update button</button>;

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
      <va-additional-info
        trigger="Where can I find my payroll deductions?"
        uswds
      >
        <p className="vads-u-padding-bottom--1">
          View your most recent pay stub to see which payroll deductions apply
          to you. It will look similar to the sample table below.
        </p>
        <va-table
          title="Sample payroll deductions"
          class="usa-table usa-table--borderless vads-u-margin-top--2"
          uswds
          aria-label="A sample two-column table from a pay stub showing common deductions and their amounts, including Federal Tax, State Tax, Health Insurance, FICA, and Retirement Accounts."
        >
          <va-table-row slot="headers">
            <span className="vads-u-padding-y--1 vads-u-border--0 vads-u-border-bottom--1px vads-u-background-color--white vads-u-border-color--gray-medium vads-u-padding-left--0">
              Deduction
            </span>
            <span className="vads-u-padding-y--1 vads-u-border--0 vads-u-border-bottom--1px vads-u-background-color--white vads-u-border-color--gray-medium vads-u-padding-right--0 vads-u-text-align--right">
              Amount
            </span>
          </va-table-row>
          <va-table-row>
            <span className="vads-u-padding-y--1 vads-u-border-color--gray-light vads-u-padding-left--0">
              Federal tax
            </span>
            <span className="vads-u-padding-y--1 vads-u-border-color--gray-light vads-u-padding-right--0 vads-u-text-align--right">
              $128.92
            </span>
          </va-table-row>
          <va-table-row>
            <span className="vads-u-padding-y--1 vads-u-border-color--gray-light vads-u-padding-left--0">
              State tax
            </span>
            <span className="vads-u-padding-y--1 vads-u-border-color--gray-light vads-u-padding-right--0 vads-u-text-align--right">
              $28.94
            </span>
          </va-table-row>
          <va-table-row>
            <span className="vads-u-padding-y--1 vads-u-border-color--gray-light vads-u-padding-left--0">
              Health Insurance
            </span>
            <span className="vads-u-padding-y--1 vads-u-border-color--gray-light vads-u-padding-right--0 vads-u-text-align--right">
              $28.25
            </span>
          </va-table-row>
          <va-table-row>
            <span className="vads-u-padding-y--1 vads-u-border-color--gray-light vads-u-padding-left--0">
              FICA
            </span>
            <span className="vads-u-padding-y--1 vads-u-border-color--gray-light vads-u-padding-right--0 vads-u-text-align--right">
              $68.36
            </span>
          </va-table-row>
          <va-table-row>
            <span className="vads-u-padding-y--1 vads-u-border-color--gray-light vads-u-padding-left--0">
              Retirement acccount
            </span>
            <span className="vads-u-padding-y--1 vads-u-border-color--gray-light vads-u-padding-right--0 vads-u-text-align--right">
              $82.45
            </span>
          </va-table-row>
        </va-table>
      </va-additional-info>
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
