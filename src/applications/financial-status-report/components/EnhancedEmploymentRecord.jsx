import React, { useState } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { setData } from 'platform/forms-system/src/js/actions';
import { Select } from '@department-of-veterans-affairs/component-library';
import { VaDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';
import { parseISODate } from 'platform/forms-system/src/js/helpers';
// import URLSearchParams from 'url-search-params';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

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
  // console.log('data', data);
  // console.log('goToPath', goToPath);
  // console.log('goBack', goBack);
  // console.log('onReviewPage', onReviewPage);
  // console.log('setFormData', setFormData);

  const [employmentRecord, setEmploymentRecord] = useState({
    ...defaultRecord[0],
  });

  const handleChange = (key, value) => {
    // console.log('handleChange', key, value);
    setEmploymentRecord({
      ...employmentRecord,
      [key]: value,
    });
  };

  // const [fromDateError, setFromDateError] = useState();
  // const [toDateError, setToDateError] = useState();

  // // let index = new URLSearchParams(window.location.search).get('index');

  const userType = 'veteran';
  const userArray = 'currEmployment';

  const employment = defaultRecord;

  const index = 0;

  const { from, to } = employmentRecord;

  const { month: fromMonth, year: fromYear } = parseISODate(from);
  const { month: toMonth, year: toYear } = parseISODate(to);
  // const { submitted } = formContext;

  // const typeError = 'Please enter the type of work.';
  // const startError = 'Please enter your employment start date.';
  // const endError = 'Please enter your employment end date.';
  // const employerError = 'Please enter your employer name.';

  const updateFormData = e => {
    e.preventDefault();
    setFormData({
      ...data,
      [`${userArray}`]: employmentRecord.isCurrent ? [employmentRecord] : [],
      personalData: {
        ...data.personalData,
        employmentHistory: {
          ...data.personalData.employmentHistory,
          [`${userType}`]: {
            ...data.personalData.employmentHistory[`${userType}`],
            employmentRecords: [employmentRecord],
          },
        },
      },
    });

    goToPath('/gross-monthly-income');
  };

  const handleCheckboxChange = (key, val) => {
    setEmploymentRecord({
      ...employmentRecord,
      [key]: val,
      to: '',
    });
  };

  // const validateYear = (monthYear, errorSetter, requiredMessage) => {
  //   // const [year] = monthYear.split('-');
  //   // const todayYear = new Date().getFullYear();
  //   // const isComplete = /\d{4}-\d{1,2}/.test(monthYear);
  //   // if (!isComplete) {
  //   //   // This allows a custom required error message to be used
  //   //   errorSetter(requiredMessage);
  //   // } else if (
  //   //   !!year &&
  //   //   (parseInt(year, 10) > todayYear || parseInt(year, 10) < 1900)
  //   // ) {
  //   //   errorSetter(`Please enter a year between 1900 and ${todayYear}`);
  //   // } else {
  //   //   errorSetter(null);
  //   // }
  // };

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
          onValueChange={({ value }) => handleChange('type', value)}
          options={['Full time', 'Part time', 'Seasonal', 'Temporary']}
          value={{
            value: employmentRecord.type || '',
          }}
          required
          // errorMessage={submitted && !employment[index].type && typeError}
        />
      </div>
      <div className="vads-u-margin-top--3">
        <VaDate
          monthYearOnly
          value={`${fromYear}-${fromMonth}`}
          label="Date you started work at this job?"
          name="from"
          onDateChange={e => handleDateChange('from', e.target.value)}
          // onDateBlur={e =>
          //   validateYear(e.target.value || '', setFromDateError, startError)
          // }
          required
          // error={fromDateError}
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
          // onDateBlur={e =>
          //   validateYear(e.target.value || '', setToDateError, endError)
          // }
          required
          // error={toDateError}
        />
      </div>
      <Checkbox
        name="current-employment"
        label="I currently work here"
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
          onValueChange={({ value }) => handleChange('employerName', value)}
          required
          // errorMessage={
          //   submitted && !employment[index].employerName && employerError
          // }
        />
      </div>
      {onReviewPage ? updateButton : navButtons}
    </form>
  );
};

const mapStateToProps = () => {};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EmploymentRecord);
