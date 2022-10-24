import React, { useState } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { setData } from 'platform/forms-system/src/js/actions';
import { Select } from '@department-of-veterans-affairs/component-library';
import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';
import { parseISODate } from 'platform/forms-system/src/js/helpers';

const defaultRecord = [
  {
    type: '',
    from: '',
    to: '',
    isCurrent: false,
    employerName: '',
  },
];

const EmploymentRecord = ({
  idSchema,
  uiSchema,
  formData,
  setFormData,
  employmentHistory,
  formContext,
}) => {
  const [fromDateError, setFromDateError] = useState();
  const [toDateError, setToDateError] = useState();

  const index = Number.isNaN(Number(idSchema.$id.slice(-1)))
    ? 0
    : Number(idSchema.$id.slice(-1));

  const { userType, userArray } = uiSchema['ui:options'];
  const { employmentRecords } = employmentHistory[`${userType}`];
  const employment = employmentRecords || defaultRecord;
  const { from, to } = employment ? employment[index] : [];
  const { month: fromMonth, year: fromYear } = parseISODate(from);
  const { month: toMonth, year: toYear } = parseISODate(to);
  const { submitted } = formContext;

  const typeError = 'Please enter the type of work.';
  const startError = 'Please enter your employment start date.';
  const endError = 'Please enter your employment end date.';
  const employerError = 'Please enter your employer name.';

  const updateFormData = updated => {
    setFormData({
      ...formData,
      [`${userArray}`]: updated.filter(record => record.isCurrent),
      personalData: {
        ...formData.personalData,
        employmentHistory: {
          ...employmentHistory,
          [`${userType}`]: {
            ...employmentHistory[`${userType}`],
            employmentRecords: [...updated],
          },
        },
      },
    });
  };

  const handleChange = (key, val) => {
    const updated = employment.map((item, i) => {
      return i === index ? { ...item, [key]: val } : item;
    });

    updateFormData(updated);
  };

  const handleCheckboxChange = (key, val) => {
    const updated = employment.map((item, i) => {
      return i === index ? { ...item, [key]: val, to: '' } : item;
    });

    updateFormData(updated);
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

    const updated = employment.map((item, i) => {
      return i === index ? { ...item, [key]: dateString } : item;
    });

    updateFormData(updated);
  };

  return (
    <>
      <div className="input-size-5">
        <Select
          label="Type of work"
          name="type"
          onValueChange={({ value }) => handleChange('type', value)}
          options={['Full time', 'Part time', 'Seasonal', 'Temporary']}
          value={{
            value: employment[index].type || '',
          }}
          required
          errorMessage={submitted && !employment[index].type && typeError}
        />
      </div>
      <div className="vads-u-margin-top--3">
        <VaDate
          monthYearOnly
          value={`${fromYear}-${fromMonth}`}
          label="Date you started work at this job?"
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
          'field-disabled': employment[index].isCurrent,
        })}
      >
        <VaDate
          monthYearOnly
          value={`${toYear}-${toMonth}`}
          label="Date you stopped work at this job?"
          name="to"
          onDateChange={e => handleDateChange('to', e.target.value)}
          onDateBlur={e =>
            validateYear(e.target.value || '', setToDateError, endError)
          }
          required
          error={toDateError}
        />
      </div>
      <Checkbox
        name="current-employment"
        label="I currently work here"
        checked={employment[index].isCurrent || false}
        onValueChange={value => handleCheckboxChange('isCurrent', value)}
      />
      <div className="input-size-6 vads-u-margin-bottom--2">
        <TextInput
          field={{
            value: employment[index].employerName || '',
          }}
          label="Employer name"
          name="employerName"
          onValueChange={({ value }) => handleChange('employerName', value)}
          required
          errorMessage={
            submitted && !employment[index].employerName && employerError
          }
        />
      </div>
    </>
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
