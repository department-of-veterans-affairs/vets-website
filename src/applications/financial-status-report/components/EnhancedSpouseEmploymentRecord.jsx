import React, { useState } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { setData } from 'platform/forms-system/src/js/actions';
import { Select } from '@department-of-veterans-affairs/component-library';
import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';
import { parseISODate } from 'platform/forms-system/src/js/helpers';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { getJobIndex } from '../utils/session';

const defaultRecord = [
  {
    type: '',
    from: '',
    to: '',
    isCurrent: false,
    employerName: '',
  },
];

const EmploymentRecord = props => {
  const { data, goToPath, goBack, onReviewPage, setFormData } = props;

  const editIndex = getJobIndex();

  const isEditing = editIndex && !Number.isNaN(editIndex);

  const index = isEditing ? Number(editIndex) : 0;

  // if we have employment history and plan to edit, we need to get it from the employmentRecords
  const specificRecord = data.personalData.employmentHistory.spouse
    .employmentRecords
    ? data.personalData.employmentHistory.spouse.employmentRecords[index]
    : defaultRecord[0];

  const [employmentRecord, setEmploymentRecord] = useState({
    ...(isEditing ? specificRecord : defaultRecord[0]),
  });

  const [employmentRecordIsDirty, setEmploymentRecordIsDirty] = useState(false);
  const [employerNameIsDirty, setEmployerNameIsDirty] = useState(false);

  const handleChange = (key, value) => {
    setEmploymentRecord({
      ...employmentRecord,
      [key]: value,
    });
  };

  const handleEmploymentRecordChange = value => {
    handleChange('type', value);
    setEmploymentRecordIsDirty(true);
  };

  const handleEmployerNameChange = value => {
    handleChange('employerName', value);
    setEmployerNameIsDirty(true);
  };

  const [fromDateError, setFromDateError] = useState();
  // const [toDateError, setToDateError] = useState();

  const userType = 'spouse';
  const userArray = 'currEmployment';

  const { from, to } = employmentRecord;

  const { month: fromMonth, year: fromYear } = parseISODate(from);
  const { month: toMonth, year: toYear } = parseISODate(to);

  const typeError = 'Please enter the type of work.';
  const startError = 'Please enter your employment start date.';
  const employerError = 'Please enter your employer name.';

  const updateFormData = e => {
    e.preventDefault();
    if (isEditing) {
      // find the one we are editing in the employeeRecords array
      const updatedRecords = data.personalData.employmentHistory.spouse.employmentRecords.map(
        (item, arrayIndex) => {
          return arrayIndex === index ? employmentRecord : item;
        },
      );
      // update form data
      setFormData({
        ...data,
        [`${userArray}`]: employmentRecord.isCurrent ? [employmentRecord] : [],
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
    } else {
      const records = [
        employmentRecord,
        ...(data.personalData.employmentHistory.spouse.employmentRecords
          ? data.personalData.employmentHistory.spouse.employmentRecords
          : []),
      ];

      setFormData({
        ...data,
        [`${userArray}`]: employmentRecord.isCurrent ? [employmentRecord] : [],
        personalData: {
          ...data.personalData,
          employmentHistory: {
            ...data.personalData.employmentHistory,
            [`${userType}`]: {
              ...data.personalData.employmentHistory[`${userType}`],
              employmentRecords: records,
            },
          },
        },
      });
    }
    if (employmentRecord.isCurrent) {
      goToPath(`/spouse-gross-monthly-income`);
    } else {
      goToPath(`/spouse-employment-history`);
    }
  };

  const handleCheckboxChange = (key, val) => {
    setEmploymentRecord({
      ...employmentRecord,
      [key]: val,
      to: '',
    });
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

  const handleDateChange = (key, monthYear) => {
    const dateString = `${monthYear}-XX`;
    handleChange(key, dateString);
  };

  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  return (
    <form onSubmit={updateFormData}>
      <div className="input-size-5">
        <Select
          label="Type of work"
          name="type"
          onValueChange={({ value }) => handleEmploymentRecordChange(value)}
          options={['Full time', 'Part time', 'Seasonal', 'Temporary']}
          value={{
            value: employmentRecord.type || '',
          }}
          required
          errorMessage={
            employmentRecordIsDirty && !employmentRecord.type && typeError
          }
        />
      </div>
      <div className="vads-u-margin-top--3">
        <VaDate
          monthYearOnly
          value={`${fromYear}-${fromMonth}`}
          label="Date your spouse started work at this job?"
          name="from"
          onDateChange={e => handleDateChange('from', e.target.value)}
          onDateBlur={e =>
            validateYear(e.target.value || '', setFromDateError, startError)
          }
          required
          error={fromDateError}
        />
      </div>
      <div
        className={classNames('vads-u-margin-top--3', {
          'field-disabled': employmentRecord.isCurrent,
        })}
      >
        <VaDate
          monthYearOnly
          value={`${toYear}-${toMonth}`}
          label="Date your spouse stopped work at this job?"
          name="to"
          onDateChange={e => handleDateChange('to', e.target.value)}
          // onDateBlur={e =>
          //   validateYear(e.target.value || '', setToDateError, endError)
          // }
          required
          // error={toDateError}
        />
      </div>
      <Checkbox
        name="current-employment"
        label="My spouse currently works here"
        checked={employmentRecord.isCurrent || false}
        onValueChange={value => handleCheckboxChange('isCurrent', value)}
      />
      <div className="input-size-6 vads-u-margin-bottom--2">
        <TextInput
          field={{
            value: employmentRecord.employerName || '',
          }}
          label="Employer name"
          name="employerName"
          onValueChange={({ value }) => handleEmployerNameChange(value)}
          required
          errorMessage={
            employerNameIsDirty &&
            !employmentRecord.employerName &&
            employerError
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
)(EmploymentRecord);
