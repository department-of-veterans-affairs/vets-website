import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { parseISODate } from 'platform/forms-system/src/js/helpers';
import PropTypes from 'prop-types';

import ButtonGroup from '../shared/ButtonGroup';
import {
  getJobIndex,
  getJobButton,
  jobButtonConstants,
} from '../../utils/session';
import { BASE_EMPLOYMENT_RECORD } from '../../constants/index';
import { isValidStartDate, isValidEndDate } from '../../utils/helpers';

const SpouseEmploymentWorkDates = props => {
  const { goToPath, setFormData, data } = props;

  const RETURN_PATH = '/enhanced-spouse-employment-records';
  const editIndex = getJobIndex();
  const isEditing = editIndex && !Number.isNaN(editIndex);
  const index = isEditing ? Number(editIndex) : 0;

  const userType = 'spouse';

  const {
    personalData: {
      employmentHistory: {
        spouse: { spEmploymentRecords = [] } = {},
        newRecord = {},
      } = {},
    },
  } = data;

  const [employmentRecord, setEmploymentRecord] = useState(
    isEditing ? spEmploymentRecords[index] : newRecord,
  );

  const { employerName = '', from, to } = employmentRecord;
  const { month: fromMonth, year: fromYear } = parseISODate(from);
  const { month: toMonth, year: toYear } = parseISODate(to);

  const fromErrorMessage = "Please enter your spouse's employment start date.";
  const toErrorMessage = "Please enter your spouse's employment end date.";

  const [fromDateError, setFromDateError] = useState(null);
  const [toDateError, setToDateError] = useState(null);

  /**
   * Update local record state
   */
  const handleChange = (key, value) => {
    setEmploymentRecord(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * Final check before submission
   */
  const updateFormData = () => {
    const { from: startDate, to: endDate, isCurrent } = employmentRecord;

    // Check validity
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

    // If editing existing record
    if (isEditing) {
      const updatedRecords = spEmploymentRecords.map((item, idx) =>
        idx === index ? employmentRecord : item,
      );
      setFormData({
        ...data,
        personalData: {
          ...data.personalData,
          employmentHistory: {
            ...data.personalData.employmentHistory,
            [userType]: {
              ...data.personalData.employmentHistory[userType],
              spEmploymentRecords: updatedRecords,
            },
          },
        },
      });
      return isCurrent
        ? goToPath(`/spouse-gross-monthly-income`)
        : goToPath(`/spouse-employment-history`);
    }

    // Otherwise, adding a new record
    if (isCurrent) {
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
      return goToPath(`/spouse-gross-monthly-income`);
    }

    // Not current job => push new record + reset newRecord
    setFormData({
      ...data,
      personalData: {
        ...data.personalData,
        employmentHistory: {
          ...data.personalData.employmentHistory,
          newRecord: { ...BASE_EMPLOYMENT_RECORD },
          [userType]: {
            ...data.personalData.employmentHistory[userType],
            spEmploymentRecords: [employmentRecord, ...spEmploymentRecords],
          },
        },
      },
    });
    return goToPath(`/spouse-employment-history`);
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
        // Validate end date (if spouse is NOT currently employed)
        if (
          !employmentRecord.isCurrent &&
          !isValidEndDate(employmentRecord.from, dateString)
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
      if (
        employmentRecord.isCurrent ||
        getJobButton() === jobButtonConstants.FIRST_JOB
      ) {
        return 'Continue';
      }
      if (getJobButton() === jobButtonConstants.EDIT_JOB) {
        return 'Update employment record';
      }
      return 'Add employment record';
    },
  };

  const ShowWorkDates = () => (
    <div className="vads-u-margin-top--3">
      <VaDate
        monthYearOnly
        value={`${fromYear}-${fromMonth}`}
        label="Date your spouse started work at this job?"
        name="from"
        required
        onDateChange={e => handlers.handleDateChange('from', e.target.value)}
        error={fromDateError}
      />
      {!employmentRecord.isCurrent && (
        <VaDate
          monthYearOnly
          value={`${toYear}-${toMonth}`}
          label="Date your spouse stopped work at this job?"
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
          Your spouse’s job at {employerName}
        </legend>
        {ShowWorkDates()}
      </fieldset>

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
    </form>
  );
};

SpouseEmploymentWorkDates.propTypes = {
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
        spouse: PropTypes.shape({
          spEmploymentRecords: PropTypes.arrayOf(
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
)(SpouseEmploymentWorkDates);
