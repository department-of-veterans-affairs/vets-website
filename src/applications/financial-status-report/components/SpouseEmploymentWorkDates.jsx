import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { parseISODate } from 'platform/forms-system/src/js/helpers';
import PropTypes from 'prop-types';
import { getJobIndex } from '../utils/session';
import { BASE_EMPLOYMENT_RECORD } from '../constants/index';
import { isValidPastDate } from '../utils/helpers';

const SpouseEmploymentWorkDates = props => {
  const { goToPath, setFormData, data } = props;

  const RETURN_PATH = '/enhanced-spouse-employment-records';

  const editIndex = getJobIndex();

  const index = Number(editIndex) ?? 0;

  const isEditing = editIndex && !Number.isNaN(editIndex);

  const userType = 'spouse';

  const {
    personalData: {
      employmentHistory: {
        newRecord = {},
        spouse: { spEmploymentRecords = [] },
      },
    },
  } = data;

  const [employmentRecord, setEmploymentRecord] = useState({
    ...(isEditing ? spEmploymentRecords[index] : newRecord),
  });

  const { employerName = '', from, to } = employmentRecord;

  const { month: fromMonth, year: fromYear } = parseISODate(from);
  const { month: toMonth, year: toYear } = parseISODate(to);

  const fromError = "Please enter your spouse's employment start date.";
  const toError = "Please enter your spouse's employment end date.";

  const [toDateError, setToDateError] = useState();
  const [fromDateError, setFromDateError] = useState();

  const updateFormData = e => {
    e.preventDefault();
    if (fromDateError || (toDateError && !employmentRecord.isCurrent))
      return null;

    if (isEditing) {
      // find the one we are editing in the employeeRecords array
      const updatedRecords = spEmploymentRecords.map((item, arrayIndex) => {
        return arrayIndex === index ? employmentRecord : item;
      });
      // update form data
      setFormData({
        ...data,
        personalData: {
          ...data.personalData,
          employmentHistory: {
            ...data.personalData.employmentHistory,
            [`${userType}`]: {
              ...data.personalData.employmentHistory[`${userType}`],
              spEmploymentRecords: updatedRecords,
            },
          },
        },
      });
      if (employmentRecord.isCurrent) {
        return goToPath(`/spouse-gross-monthly-income`);
      }
      return goToPath(`/spouse-employment-history`);
    }

    // we are not editing a record, so we are adding a new one
    if (employmentRecord.isCurrent) {
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

    setFormData({
      ...data,
      personalData: {
        ...data.personalData,
        employmentHistory: {
          ...data.personalData.employmentHistory,
          newRecord: { ...BASE_EMPLOYMENT_RECORD },
          [`${userType}`]: {
            ...data.personalData.employmentHistory[`${userType}`],
            spEmploymentRecords: [
              { ...employmentRecord },
              ...spEmploymentRecords,
            ],
          },
        },
      },
    });
    return goToPath(`/spouse-employment-history`);
  };

  const handleChange = (key, value) => {
    setEmploymentRecord({
      ...employmentRecord,
      [key]: value,
    });
  };

  const handlers = {
    onCancel: event => {
      event.preventDefault();
      goToPath(RETURN_PATH);
    },
    handleDateChange: (key, monthYear) => {
      const dateString = `${monthYear}-XX`;
      handleChange(key, dateString);
    },
    handleBack: event => {
      event.preventDefault();
      goToPath(RETURN_PATH);
    },
    onSubmitted: event => {
      event.preventDefault();
      updateFormData();
    },
    onUpdate: () => {
      setFromDateError(
        isValidPastDate(employmentRecord.from) ? null : fromError,
      );

      setToDateError(isValidPastDate(employmentRecord.to) ? null : toError);
    },
  };

  const ShowWorkDates = () => {
    return (
      <div className="vads-u-margin-top--3">
        <VaDate
          monthYearOnly
          value={`${fromYear}-${fromMonth}`}
          label="Date your spouse started work at this job?"
          name="from"
          onDateChange={e => handlers.handleDateChange('from', e.target.value)}
          required
          error={fromDateError}
        />
        {!employmentRecord.isCurrent ? (
          <VaDate
            monthYearOnly
            value={`${toYear}-${toMonth}`}
            label="Date your spouse stopped work at this job?"
            name="to"
            onDateChange={e => handlers.handleDateChange('to', e.target.value)}
            required
            error={toDateError}
          />
        ) : null}
      </div>
    );
  };

  return (
    <form onSubmit={updateFormData}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          Your spouse’s job at {employerName}
        </legend>
        <div>{ShowWorkDates()}</div>
      </fieldset>
      <p>
        <button
          type="button"
          id="cancel"
          className="usa-button-secondary vads-u-width--auto"
          onClick={handlers.onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          id="submit"
          className="vads-u-width--auto"
          onClick={handlers.onUpdate}
        >
          {`${
            spEmploymentRecords.length === index ? 'Update' : 'Add'
          } employment record`}
        </button>
      </p>
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
)(SpouseEmploymentWorkDates);

SpouseEmploymentWorkDates.propTypes = {
  employmentHistory: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
};
