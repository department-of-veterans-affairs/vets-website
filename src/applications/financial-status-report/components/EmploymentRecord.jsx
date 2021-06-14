import React from 'react';
import { connect } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import Select from '@department-of-veterans-affairs/component-library/Select';
import MonthYear from '@department-of-veterans-affairs/component-library/MonthYear';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';
import { parseISODate } from 'platform/forms-system/src/js/helpers';
import classNames from 'classnames';

const EmploymentRecord = ({
  idSchema,
  formData,
  setFormData,
  employmentHistory,
}) => {
  const index = Number(idSchema.$id.slice(-1));
  const { veteran } = employmentHistory;
  const { employmentRecords } = veteran;
  const { from, to } = employmentRecords[index];
  const { month: fromMonth, year: fromYear } = parseISODate(from);
  const { month: toMonth, year: toYear } = parseISODate(to);
  const currentEmployment = employmentRecords.filter(
    record => record.isCurrent,
  );

  const updateFormData = updated => {
    setFormData({
      ...formData,
      currentEmployment,
      personalData: {
        ...formData.personalData,
        employmentHistory: {
          ...employmentHistory,
          veteran: {
            ...veteran,
            employmentRecords: [...updated],
          },
        },
      },
    });
  };

  const handleChange = (key, value) => {
    const updated = employmentRecords.map((item, i) => {
      return i === index ? { ...item, [key]: value } : item;
    });
    updateFormData(updated);
  };

  const handleDateChange = (key, value) => {
    const { month, year } = value;
    const dateString = `${year.value}-${month.value}-XX`;
    const updated = employmentRecords.map((item, i) => {
      return i === index ? { ...item, [key]: dateString } : item;
    });
    updateFormData(updated);
  };

  return (
    <>
      <div className="input-size-3">
        <Select
          label="Type of work"
          name="type"
          onValueChange={({ value }) => handleChange('type', value)}
          options={['Full time', 'Part time', 'Seasonal', 'Temporary']}
          value={{
            value: employmentRecords[index].type || '',
          }}
          required
        />
      </div>

      <div className="vads-u-margin-top--3">
        <MonthYear
          date={{ month: { value: fromMonth }, year: { value: fromYear } }}
          label="Date you started work at this job?"
          name="from"
          onValueChange={value => handleDateChange('from', value)}
          required
        />
      </div>

      <div
        className={classNames('vads-u-margin-top--3', {
          'field-disabled': employmentRecords[index].isCurrent,
        })}
      >
        <MonthYear
          date={{ month: { value: toMonth }, year: { value: toYear } }}
          label="Date you stopped work at this job?"
          name="to"
          onValueChange={value => handleDateChange('to', value)}
          required
        />
      </div>

      <Checkbox
        label="I currently work here"
        checked={employmentRecords[index].isCurrent || false}
        onValueChange={value => handleChange('isCurrent', value)}
      />

      <div className="input-size-6 vads-u-margin-bottom--2">
        <TextInput
          field={{
            value: employmentRecords[index].employerName || '',
          }}
          label="Employer name"
          name="employerName"
          onValueChange={({ value }) => handleChange('employerName', value)}
          required
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
