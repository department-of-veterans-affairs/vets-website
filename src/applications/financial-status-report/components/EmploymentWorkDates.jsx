import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { parseISODate } from 'platform/forms-system/src/js/helpers';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { getJobIndex } from '../utils/session';
import { BASE_EMPLOYMENT_RECORD } from '../constants/index';

const EmploymentWorkDates = props => {
  const { goToPath, onReviewPage, setFormData, data } = props;

  const RETURN_PATH = '/enhanced-employment-records';

  const editIndex = getJobIndex();

  const isEditing = editIndex && !Number.isNaN(editIndex);

  const index = isEditing ? Number(editIndex) : 0;

  const userType = 'veteran';

  const {
    personalData: {
      employmentHistory: {
        newRecord = {},
        veteran: { employmentRecords = [] },
      },
    },
  } = data;

  const [employmentRecord, setEmploymentRecord] = useState({
    ...(isEditing ? employmentRecords[index] : newRecord),
  });

  const { employerName = '', from, to } = employmentRecord;

  const { month: fromMonth, year: fromYear } = parseISODate(from);
  const { month: toMonth, year: toYear } = parseISODate(to);

  const [toDateError, setToDateError] = useState();
  const [fromDateError, setFromDateError] = useState();

  const startError = 'Please enter your employment start date.';

  const updateFormData = e => {
    e.preventDefault();
    if (from) {
      if (isEditing) {
        // find the one we are editing in the employeeRecords array
        const updatedRecords = employmentRecords.map((item, arrayIndex) => {
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
                employmentRecords: updatedRecords,
              },
            },
          },
        });
        if (employmentRecord.isCurrent) {
          return goToPath(`/gross-monthly-income`);
        }
        return goToPath(`/employment-history`);
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
        return goToPath(`/gross-monthly-income`);
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
              employmentRecords: [
                { ...employmentRecord },
                ...employmentRecords,
              ],
            },
          },
        },
      });
      return goToPath(`/employment-history`);
    }
    return setFromDateError(startError);
  };

  const handleChange = (key, value) => {
    setEmploymentRecord({
      ...employmentRecord,
      [key]: value,
    });
  };

  const handlers = {
    onChange: event => {
      const { target = {} } = event;
      const fieldName = target.name;
      // detail.value from va-select & target.value from va-text-input
      const value = event.detail?.value || target.value;
      handleChange(fieldName, value);
    },
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
  };

  const validateYear = (monthYear, errorSetter, requiredMessage) => {
    const [year] = monthYear.split('-');
    const todayYear = new Date().getFullYear();
    const isComplete = /\d{4}-\d{1,2}/.test(monthYear);
    if (!isComplete) {
      // This allows a custom required error message to be used
      errorSetter(requiredMessage);
    } else if (
      !!year &&
      (parseInt(year, 10) > todayYear || parseInt(year, 10) < 1900)
    ) {
      errorSetter(`Please enter a year between 1900 and ${todayYear}`);
    } else {
      errorSetter(null);
    }
  };

  const ShowWorkDates = () => {
    return employmentRecord.isCurrent ? (
      <div>
        <div className="vads-u-margin-top--3">
          <VaDate
            monthYearOnly
            value={`${fromYear}-${fromMonth}`}
            label="Date you started work at this job?"
            name="from"
            onDateChange={e =>
              handlers.handleDateChange('from', e.target.value)
            }
            onDateBlur={e =>
              validateYear(e.target.value || '', setFromDateError, startError)
            }
            required
            error={fromDateError}
          />
        </div>
      </div>
    ) : (
      <div>
        <div className="vads-u-margin-top--3">
          <VaDate
            monthYearOnly
            value={`${fromYear}-${fromMonth}`}
            label="Date you started work at this job?"
            name="from"
            onDateChange={e =>
              handlers.handleDateChange('from', e.target.value)
            }
            onDateBlur={e =>
              validateYear(e.target.value || '', setFromDateError, startError)
            }
            required
            error={fromDateError}
          />
        </div>
        <div>
          <VaDate
            monthYearOnly
            value={`${toYear}-${toMonth}`}
            label="Date you stopped work at this job?"
            name="to"
            onDateChange={e => handlers.handleDateChange('to', e.target.value)}
            onDateBlur={e =>
              validateYear(
                e.target.value || '',
                setToDateError,
                'Please enter your employment end date.',
              )
            }
            required={employmentRecord.doesNotCurrentlyWorkHere}
            error={toDateError}
          />
        </div>
      </div>
    );
  };

  const navButtons = (
    <FormNavButtons goBack={handlers.handleBack} submitToContinue />
  );
  const updateButton = <button type="submit">Review update button</button>;

  return (
    <form onSubmit={updateFormData}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          Your job at {employerName}
        </legend>
        <div>{ShowWorkDates()}</div>
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
)(EmploymentWorkDates);
