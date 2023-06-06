import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { getJobIndex } from '../utils/session';

const SpouseGrossMonthlyIncomeInput = props => {
  const { goToPath, goBack, onReviewPage, setFormData } = props;

  const editIndex = getJobIndex();

  const isEditing = editIndex && !Number.isNaN(editIndex);

  const index = isEditing ? Number(editIndex) : 0;

  const userType = 'spouse';

  const formData = useSelector(state => state.form.data);
  const employmentRecord =
    formData.personalData.employmentHistory.spouse.employmentRecords[index];

  const {
    employerName = '',
    grossMonthlyIncome: currentGrossMonthlyIncome = '',
  } = employmentRecord;

  const [incomeError, setIncomeError] = useState(false);
  const [grossMonthlyIncome, setGrossMonthlyIncome] = useState({
    value: currentGrossMonthlyIncome,
    dirty: false,
  });

  const setNewGrossMonthlyIncome = event => {
    setGrossMonthlyIncome({ value: event.target.value, dirty: true });
  };

  const validateGrossMonthlyIncome = useCallback(
    () => {
      const regex = /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/;

      if (
        grossMonthlyIncome.value &&
        (!regex.test(grossMonthlyIncome.value) ||
          Number(grossMonthlyIncome.value) < 0)
      ) {
        setIncomeError(true);
      } else {
        setIncomeError(false);
      }
    },
    [grossMonthlyIncome],
  );

  useEffect(
    () => {
      validateGrossMonthlyIncome();
    },
    [incomeError, grossMonthlyIncome, validateGrossMonthlyIncome],
  );

  const updateFormData = e => {
    e.preventDefault();
    if (isEditing) {
      // find the one we are editing in the employeeRecords array
      const updatedRecords = formData.personalData.employmentHistory.spouse.employmentRecords.map(
        (item, arrayIndex) => {
          return arrayIndex === index
            ? {
                ...employmentRecord,
                grossMonthlyIncome: grossMonthlyIncome.value,
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
      const records = [
        {
          ...employmentRecord,
          grossMonthlyIncome: grossMonthlyIncome.value,
        },
        ...formData.personalData.employmentHistory.spouse.employmentRecords.slice(
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

    if (employmentRecord.isCurrent) {
      goToPath(`/spouse-deduction-checklist`);
    } else {
      goToPath(`/spouse-employment-history`);
    }
  };

  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  return (
    <form onSubmit={updateFormData}>
      <h3 className="schemaform-block-title vads-u-margin-top--6">
        Your spouse’s job at {employerName}
      </h3>
      <p className="vads-u-margin-bottom--0">
        What’s your spouse’s gross <strong>monthly</strong> income at this job?{' '}
        <span className="required vads-u-color--secondary-dark">
          (*Required)
        </span>
      </p>
      <p className="formfield-subtitle">
        You’ll find this in your spouse’s pay stub. It’s the amount of your
        spouse’s pay before taxes and deductions.
      </p>
      <div className="input input-size-3">
        <va-number-input
          inputmode="numeric"
          currency
          id="gross-monthly-income"
          data-testid="gross-monthly-income"
          name="gross-monthly-income"
          onInput={setNewGrossMonthlyIncome}
          type="text"
          value={grossMonthlyIncome.value}
          required
          error={
            incomeError && grossMonthlyIncome.dirty
              ? `Please enter a valid number.`
              : ''
          }
        />
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
)(SpouseGrossMonthlyIncomeInput);
