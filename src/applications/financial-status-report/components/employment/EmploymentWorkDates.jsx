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

  // If editing, pull the existing record. Otherwise, use the new record object.
  const [employmentRecord, setEmploymentRecord] = useState(
    isEditing ? employmentRecords[index] : newRecord,
  );

  const { employerName = '', from, to } = employmentRecord;

  const { month: fromMonth, year: fromYear } = parseISODate(from);
  const { month: toMonth, year: toYear } = parseISODate(to);

  const [fromDate, setFromDate] = useState(
    `${fromYear || ''}-${fromMonth || ''}`,
  );
  const [toDate, setToDate] = useState(`${toYear || ''}-${toMonth || ''}`);

  const [fromDateError, setFromDateError] = useState(null);
  const [toDateError, setToDateError] = useState(null);

  const fromErrorMessage = 'Please enter a valid employment start date.';
  const toErrorMessage = 'Please enter a valid employment end date.';

  const updateFormData = () => {
    const { isCurrent } = employmentRecord;

    const startDate = fromDate ? `${fromDate}-01` : '';
    const endDate = toDate ? `${toDate}-01` : '';

    setFromDateError(null);
    setToDateError(null);

    if (!isValidStartDate(startDate)) {
      setFromDateError(fromErrorMessage);
      return;
    }

    if (!isCurrent && !isValidEndDate(startDate, endDate)) {
      setToDateError(toErrorMessage);
      return;
    }

    const updatedRecord = {
      ...employmentRecord,
      from: startDate,
      to: endDate,
    };
    setEmploymentRecord(updatedRecord);

    // If editing existing record
    if (isEditing) {
      const updatedRecords = employmentRecords.map(
        (item, idx) => (idx === index ? updatedRecord : item),
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

      goToPath(isCurrent ? `/gross-monthly-income` : `/employment-history`);
      return;
    }

    if (isCurrent) {
      setFormData({
        ...data,
        personalData: {
          ...data.personalData,
          employmentHistory: {
            ...data.personalData.employmentHistory,
            newRecord: { ...updatedRecord },
          },
        },
      });
      goToPath(`/gross-monthly-income`);
      return;
    }

    // Not current => push new record + reset newRecord
    setFormData({
      ...data,
      personalData: {
        ...data.personalData,
        employmentHistory: {
          ...data.personalData.employmentHistory,
          newRecord: { ...BASE_EMPLOYMENT_RECORD },
          [userType]: {
            ...data.personalData.employmentHistory[userType],
            employmentRecords: [updatedRecord, ...employmentRecords],
          },
        },
      },
    });
    goToPath(`/employment-history`);
  };

  const handlers = {
    onCancel: event => {
      event.preventDefault();
      goToPath(RETURN_PATH);
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

  const ShowWorkDates = () => (
    <div className="vads-u-margin-top--3">
      <VaDate
        monthYearOnly
        value={fromDate}
        label="Date you started work at this job?"
        name="from"
        required
        onDateChange={e => setFromDate(e.target.value)}
        error={fromDateError}
      />

      {!employmentRecord.isCurrent && (
        <VaDate
          monthYearOnly
          value={toDate}
          label="Date you stopped work at this job?"
          name="to"
          required
          onDateChange={e => setToDate(e.target.value)}
          error={toDateError}
        />
      )}
    </div>
  );

  return (
    <form noValidate>
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
