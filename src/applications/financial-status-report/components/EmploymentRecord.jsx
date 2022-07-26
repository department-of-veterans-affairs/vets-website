import React, { useState } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  MonthYear,
  Select,
} from '@department-of-veterans-affairs/component-library';
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
  const [validation, setValidation] = useState([]);

  const index = Number(idSchema.$id.slice(-1));
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

  const validateYear = year => {
    const todayYear = new Date().getFullYear();

    if (
      !!year &&
      (parseInt(year.value, 10) > todayYear || parseInt(year.value, 10) < 1900)
    ) {
      setValidation([
        {
          valid: false,
          message: `Please enter a year between 1900 and ${todayYear}`,
        },
      ]);
    } else {
      setValidation([
        {
          valid: true,
        },
      ]);
    }
  };

  const handleDateChange = (key, value) => {
    const { month, year } = value;
    const dateString = `${year.value}-${month.value}-XX`;

    validateYear(year);

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
        <MonthYear
          date={{
            month: {
              value: fromMonth,
              dirty: submitted,
            },
            year: {
              value: fromYear,
              dirty: submitted,
            },
          }}
          label="Date you started work at this job?"
          name="from"
          onValueChange={value => handleDateChange('from', value)}
          required
          requiredMessage={submitted && startError}
          validation={validation}
        />
      </div>
      <div
        className={classNames('vads-u-margin-top--3', {
          'field-disabled': employment[index].isCurrent,
        })}
      >
        <MonthYear
          date={{
            month: {
              value: toMonth,
              dirty: !employment[index].isCurrent && submitted,
            },
            year: {
              value: toYear,
              dirty: !employment[index].isCurrent && submitted,
            },
          }}
          label="Date you stopped work at this job?"
          name="to"
          onValueChange={value => handleDateChange('to', value)}
          required
          requiredMessage={submitted && endError}
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

EmploymentRecord.propTypes = {
  children: PropTypes.object,
  employmentHistory: PropTypes.object,
  formContext: PropTypes.object,
  formData: PropTypes.object,
  idSchema: PropTypes.object,
  setFormData: PropTypes.func,
  uiSchema: PropTypes.object,
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
