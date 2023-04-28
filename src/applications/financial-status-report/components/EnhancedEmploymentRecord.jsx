import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  VaSelect,
  VaDate,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';
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
  const specificRecord = data.personalData.employmentHistory.veteran
    .employmentRecords
    ? data.personalData.employmentHistory.veteran.employmentRecords[index]
    : defaultRecord[0];

  const [employmentRecord, setEmploymentRecord] = useState({
    ...(isEditing ? specificRecord : defaultRecord[0]),
  });

  const [typeError, setTypeError] = useState('');
  const [employerNameError, setEmployerNameError] = useState(false);
  const [doesNotCurrentlyWorkHere, setDoesNotCurrentlyWorkHere] = useState(
    true,
  );

  const handleChange = (key, value) => {
    setEmploymentRecord({
      ...employmentRecord,
      [key]: value,
    });
  };

  const handleEmployerNameChange = event => {
    handleChange('employerName', event.target.value);
    setEmployerNameError(false);
  };
  const [toDateError, setToDateError] = useState();
  const [fromDateError, setFromDateError] = useState();

  const userType = 'veteran';
  const userArray = 'currEmployment';

  const { from, to } = employmentRecord;

  const { month: fromMonth, year: fromYear } = parseISODate(from);
  const { month: toMonth, year: toYear } = parseISODate(to);

  const startError = 'Please enter your employment start date.';

  const updateFormData = e => {
    e.preventDefault();

    if (!employmentRecord.type || employmentRecord.type === '') {
      setTypeError('Please select your type of work.');
    }

    if (!employmentRecord.employerName) {
      setEmployerNameError(true);
    } else {
      setEmployerNameError(false);
    }

    if (
      !employmentRecord.type ||
      employmentRecord.type === '' ||
      (!employmentRecord.employerName && employmentRecord.employerName !== '')
    ) {
      return;
    }
    if (isEditing) {
      // find the one we are editing in the employeeRecords array
      const updatedRecords = data.personalData.employmentHistory.veteran.employmentRecords.map(
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
        ...(data.personalData.employmentHistory.veteran.employmentRecords
          ? data.personalData.employmentHistory.veteran.employmentRecords
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
      goToPath(`/gross-monthly-income`);
    } else {
      goToPath(`/employment-history`);
    }
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

  const handlers = {
    onChange: event => {
      const { target = {} } = event;
      const fieldName = target.name;
      // detail.value from va-select & target.value from va-text-input
      const value = event.detail?.value || target.value;
      handleChange(fieldName, value);
    },
    handleDateChange: (key, monthYear) => {
      const dateString = `${monthYear}-XX`;
      handleChange(key, dateString);
    },
    handleCheckboxChange: (key, val) => {
      setDoesNotCurrentlyWorkHere(!val);
      if (val === true) {
        // if box has become checked
        setToDateError('');
      }
      setEmploymentRecord({
        ...employmentRecord,
        [key]: val,
        to: '',
      });
    },
  };

  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  return (
    <form onSubmit={updateFormData}>
      <legend className="schemaform-block-title">Add a job</legend>
      <p className="vads-u-padding-top--1">
        Tell us about any jobs you’ve had in the past 2 years that you received
        pay stubs for. You’ll need to provide your income information if it’s a
        current job.
      </p>
      <div className="input-size-5">
        <VaSelect
          id="type"
          name="type"
          label="Type of work"
          required
          value={employmentRecord.type}
          onVaSelect={handlers.onChange}
          error={typeError}
        >
          <option value=""> </option>
          <option value="Full time">Full time</option>
          <option value="Part time">Part time</option>
          <option value="Seasonal">Seasonal</option>
          <option value="Temporary">Temporary</option>
        </VaSelect>
      </div>
      <div className="vads-u-margin-top--3">
        <VaDate
          monthYearOnly
          value={`${fromYear}-${fromMonth}`}
          label="Date you started work at this job?"
          name="from"
          onDateChange={e => handlers.handleDateChange('from', e.target.value)}
          onDateBlur={e =>
            validateYear(e.target.value || '', setFromDateError, startError)
          }
          required
          error={fromDateError}
        />
      </div>
      <Checkbox
        name="current-employment"
        label="I currently work here"
        checked={employmentRecord.isCurrent || false}
        onValueChange={value =>
          handlers.handleCheckboxChange('isCurrent', value)
        }
      />
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
          required={doesNotCurrentlyWorkHere}
          error={toDateError}
        />
      </div>
      <div className="input-size-6 vads-u-margin-bottom--2">
        <va-text-input
          label="Employer name"
          name="employerName"
          onInput={handleEmployerNameChange}
          value={employmentRecord.employerName}
          required
          error={employerNameError ? 'Please enter your employer name.' : ''}
        />
      </div>
      {onReviewPage ? updateButton : navButtons}
    </form>
  );
};

EmploymentRecord.propTypes = {
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  onReviewPage: PropTypes.bool,
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
