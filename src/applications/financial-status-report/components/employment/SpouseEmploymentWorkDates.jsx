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

  const { year: fromYear, month: fromMonth } = parseISODate(from);
  const { year: toYear, month: toMonth } = parseISODate(to);

  const [fromDate, setFromDate] = useState(
    fromYear && fromMonth ? `${fromYear}-${fromMonth}` : '',
  );
  const [toDate, setToDate] = useState(
    toYear && toMonth ? `${toYear}-${toMonth}` : '',
  );

  const [fromDateError, setFromDateError] = useState(null);
  const [toDateError, setToDateError] = useState(null);

  const fromErrorMessage = "Please enter your spouse's employment start date.";
  const toErrorMessage = "Please enter your spouse's employment end date.";

  const updateFormData = () => {
    const { isCurrent } = employmentRecord;

    const safeStart = fromDate ? `${fromDate}-01` : '';
    const safeEnd = toDate ? `${toDate}-01` : '';

    setFromDateError(null);
    setToDateError(null);

    if (!isValidStartDate(safeStart)) {
      setFromDateError(fromErrorMessage);
      return;
    }

    if (!isCurrent && !isValidEndDate(safeStart, safeEnd)) {
      setToDateError(toErrorMessage);
      return;
    }

    const updatedRecord = {
      ...employmentRecord,
      from: safeStart,
      to: safeEnd,
    };
    setEmploymentRecord(updatedRecord);

    // If editing existing record
    if (isEditing) {
      const updatedRecords = spEmploymentRecords.map(
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
              spEmploymentRecords: updatedRecords,
            },
          },
        },
      });
      goToPath(
        isCurrent
          ? `/spouse-gross-monthly-income`
          : `/spouse-employment-history`,
      );
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
      goToPath(`/spouse-gross-monthly-income`);
      return;
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
            spEmploymentRecords: [updatedRecord, ...spEmploymentRecords],
          },
        },
      },
    });
    goToPath(`/spouse-employment-history`);
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
        value={fromDate}
        label="Date your spouse started work at this job?"
        name="from"
        required
        onDateChange={e => setFromDate(e.target.value)}
        error={fromDateError}
      />

      {!employmentRecord.isCurrent && (
        <VaDate
          monthYearOnly
          value={toDate}
          label="Date your spouse stopped work at this job?"
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
