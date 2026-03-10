import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

import { parseISODate } from 'platform/forms-system/src/js/helpers';
import { isValidStartDate, isValidEndDate } from '../../utils/helpers';
import {
  getJobIndex,
  getJobButton,
  jobButtonConstants,
} from '../../utils/session';
import { BASE_EMPLOYMENT_RECORD } from '../../constants/index';
import ButtonGroup from '../shared/ButtonGroup';

const EmploymentWorkDates = props => {
  const { goToPath, setFormData, data } = props;

  const RETURN_PATH = '/enhanced-employment-records';

  const editIndex = getJobIndex();
  const isEditing = editIndex && !Number.isNaN(editIndex);
  const index = isEditing ? Number(editIndex) : 0;

  const userType = 'veteran';

  const {
    personalData: {
      employmentHistory: {
        veteran: { employmentRecords = [] } = {},
        newRecord = {},
      } = {},
    },
  } = data;

  const [employmentRecord, setEmploymentRecord] = useState(
    isEditing ? employmentRecords[index] : newRecord,
  );

  const { employerName = '', from, to } = employmentRecord;

  // Parse the 'from' and 'to' into { month, year } for VaDate
  const { month: fromMonth, year: fromYear } = parseISODate(from);
  const { month: toMonth, year: toYear } = parseISODate(to);

  const fromErrorMessage = 'Please enter a valid employment start date.';
  const toErrorMessage = 'Please enter a valid employment end date.';

  const [fromDateError, setFromDateError] = useState(null);
  const [toDateError, setToDateError] = useState(null);

  const handleChange = (key, value) => {
    setEmploymentRecord(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateFormData = () => {
    const { from: startDate, to: endDate, isCurrent } = employmentRecord;

    // If start date or end date is invalid, set errors and stop
    if (
      !isValidStartDate(startDate) ||
      (!isCurrent && !isValidEndDate(startDate, endDate))
    ) {
      setFromDateError(!isValidStartDate(startDate) ? fromErrorMessage : null);
      setToDateError(
        !isCurrent && !isValidEndDate(startDate, endDate)
          ? toErrorMessage
          : null,
      );
      return null;
    }

    // Past this point, we know the date(s) are valid
    if (isEditing) {
      const updatedRecords = employmentRecords.map(
        (item, idx) => (idx === index ? employmentRecord : item),
      );

      setFormData({
        ...data,
        personalData: {
          ...data.personalData,
          employmentHistory: {
            ...data.personalData.employmentHistory,
            [userType]: {
              ...data.personalData.employmentHistory[userType],
              employmentRecords: updatedRecords,
            },
          },
        },
      });

      // If current job, go to gross monthly income; else go back
      return employmentRecord.isCurrent
        ? goToPath(`/gross-monthly-income`)
        : goToPath(`/employment-history`);
    }

    // Otherwise, adding a brand new record
    if (employmentRecord.isCurrent) {
      // Store new record for “current job”
      setFormData({
        ...data,
        personalData: {
          ...data.personalData,
          employmentHistory: {
            ...data.personalData.employmentHistory,
            newRecord: { ...employmentRecord },
          },
        },
      });
      return goToPath(`/gross-monthly-income`);
    }

    // Store record in array + reset newRecord
    setFormData({
      ...data,
      personalData: {
        ...data.personalData,
        employmentHistory: {
          ...data.personalData.employmentHistory,
          newRecord: { ...BASE_EMPLOYMENT_RECORD },
          [userType]: {
            ...data.personalData.employmentHistory[userType],
            employmentRecords: [employmentRecord, ...employmentRecords],
          },
        },
      },
    });
    return goToPath(`/employment-history`);
  };

  const handlers = {
    onCancel: event => {
      event.preventDefault();
      goToPath(RETURN_PATH);
    },
    handleDateChange: (key, rawMonthYear) => {
      const dateString = `${rawMonthYear}-01`;
      handleChange(key, dateString);
      if (key === 'from') {
        if (!isValidStartDate(dateString)) {
          setFromDateError(fromErrorMessage);
        } else {
          setFromDateError(null);
        }
      }
      if (key === 'to') {
        if (
          !isValidEndDate(employmentRecord.from, dateString) &&
          !employmentRecord.isCurrent
        ) {
          setToDateError(toErrorMessage);
        } else {
          setToDateError(null);
        }
      }
    },
    onUpdate: event => {
      event.preventDefault();
      updateFormData();
    },
    getContinueButtonText: () => {
      const btn = getJobButton();
      if (employmentRecord.isCurrent || btn === jobButtonConstants.FIRST_JOB) {
        return 'Continue';
      }
      if (btn === jobButtonConstants.EDIT_JOB) {
        return 'Update employment record';
      }
      return 'Add employment record';
    },
  };

  /**
   * Render the date fields. Note how we pass `onDateChange` to do immediate checks.
   */
  const ShowWorkDates = () => (
    <div className="vads-u-margin-top--3">
      <VaDate
        monthYearOnly
        value={`${fromYear}-${fromMonth}`} // e.g., "2021-01"
        label="Date you started work at this job?"
        name="from"
        required
        onDateChange={e => handlers.handleDateChange('from', e.target.value)}
        error={fromDateError}
      />
      {!employmentRecord.isCurrent && (
        <VaDate
          monthYearOnly
          value={`${toYear}-${toMonth}`}
          label="Date you stopped work at this job?"
          name="to"
          required
          onDateChange={e => handlers.handleDateChange('to', e.target.value)}
          error={toDateError}
        />
      )}
    </div>
  );

  return (
    <form>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          Your job at {employerName}
        </legend>
        {ShowWorkDates()}
        <ButtonGroup
          buttons={[
            {
              label: 'Back',
              onClick: handlers.onCancel,
              isSecondary: true,
            },
            {
              label: handlers.getContinueButtonText(),
              onClick: handlers.onUpdate,
              isSubmitting: 'prevent',
            },
          ]}
        />
      </fieldset>
    </form>
  );
};

EmploymentWorkDates.propTypes = {
  data: PropTypes.shape({
    personalData: PropTypes.shape({
      employmentHistory: PropTypes.shape({
        newRecord: PropTypes.shape({
          employerName: PropTypes.string,
          from: PropTypes.string,
          to: PropTypes.string,
          type: PropTypes.string,
          grossMonthlyIncome: PropTypes.string,
          deductions: PropTypes.array,
          isCurrent: PropTypes.bool,
        }),
        veteran: PropTypes.shape({
          employmentRecords: PropTypes.arrayOf(
            PropTypes.shape({
              employerName: PropTypes.string,
              from: PropTypes.string,
              to: PropTypes.string,
              type: PropTypes.string,
              grossMonthlyIncome: PropTypes.string,
              deductions: PropTypes.array,
              isCurrent: PropTypes.bool,
            }),
          ),
        }),
      }),
    }),
  }).isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
};

const mapStateToProps = ({ form }) => ({
  formData: form.data,
  employmentHistory: form.data.personalData.employmentHistory,
});

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EmploymentWorkDates);
