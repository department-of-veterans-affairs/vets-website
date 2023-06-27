import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  VaSelect,
  VaDate,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Checkbox from '@department-of-veterans-affairs/component-library/Checkbox';
import { parseISODate } from 'platform/forms-system/src/js/helpers';
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

const RETURN_PATH = '/spouse-employment-history';

const EmploymentRecord = props => {
  const { data, goToPath, setFormData } = props;

  const editIndex = getJobIndex();

  const isEditing = editIndex && !Number.isNaN(editIndex);

  const index = isEditing ? Number(editIndex) : 0;

  const {
    personalData: {
      employmentHistory: {
        spouse: { employmentRecords = [] },
      },
    },
  } = data;

  // if we have employment history and plan to edit, we need to get it from the employmentRecords
  const specificRecord = employmentRecords
    ? employmentRecords[index]
    : defaultRecord[0];

  const [employmentRecord, setEmploymentRecord] = useState({
    ...(isEditing ? specificRecord : defaultRecord[0]),
  });
  const [employerName, setEmployerName] = useState(
    employmentRecord.employerName || null,
  );
  const [submitted, setSubmitted] = useState(false);
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
    setEmployerName(event.target.value);
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
    handleCheckboxChange: (key, val) => {
      setDoesNotCurrentlyWorkHere(!val);
      setEmploymentRecord({
        ...employmentRecord,
        [key]: val,
        to: '',
      });
    },
  };

  const [fromDateError, setFromDateError] = useState();
  const [typeError, setTypeError] = useState('');

  const userType = 'spouse';
  const userArray = 'currEmployment';

  const { from, to } = employmentRecord;

  const { month: fromMonth, year: fromYear } = parseISODate(from);
  const { month: toMonth, year: toYear } = parseISODate(to);

  const startError = 'Please enter your employment start date.';
  const nameError = !employerName ? 'Please enter your employer name.' : null;

  const updateFormData = e => {
    e.preventDefault();
    setSubmitted(true);

    if (!employmentRecord.type || employmentRecord.type === '') {
      setTypeError('Please select your type of work.');
    }

    if (!employmentRecord.employerName) {
      return;
    }

    if (isEditing) {
      // find the one we are editing in the employeeRecords array
      const updatedRecords = employmentRecords.map((item, arrayIndex) => {
        return arrayIndex === index ? employmentRecord : item;
      });
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
      const records = [employmentRecord, ...(employmentRecords || [])];

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

  return (
    <form onSubmit={updateFormData}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Add a job</h3>
        </legend>
        <p>
          Tell us about any jobs your spouse had in the past 2 years that they
          received pay stubs for. You’ll need to provide their income
          information if it’s a current job.
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
            class="advanced-search-field"
          >
            <option value=""> </option>
            <option value="Full time">Full time</option>
            <option value="Part time">Part time</option>
            <option value="Seasonal">Seasonal</option>
            <option value="Temporary">Temporary</option>
          </VaSelect>
        </div>
        <div className="input-size-7 vads-u-margin-bottom--2">
          <VaTextInput
            className="no-wrap"
            error={(submitted && nameError) || null}
            id="employer-name"
            label="Employer name"
            name="employer-name"
            onInput={handleEmployerNameChange}
            required
            type="text"
            value={employerName || ''}
          />
        </div>
        <div className="vads-u-margin-top--3">
          <VaDate
            monthYearOnly
            value={`${fromYear}-${fromMonth}`}
            label="Date your spouse started work at this job?"
            name="from"
            onDateChange={e =>
              handlers.handleDateChange('from', e.target.value)
            }
            onDateBlur={e =>
              validateYear(e.target.value || '', setFromDateError, startError)
            }
            className="vads-u-margin-top--0"
            required
            error={fromDateError}
          />
        </div>
        <div>
          <VaDate
            monthYearOnly
            value={`${toYear}-${toMonth}`}
            label="Date your spouse stopped work at this job?"
            name="to"
            onDateChange={e => handlers.handleDateChange('to', e.target.value)}
            // onDateBlur={e =>
            //   validateYear(e.target.value || '', setToDateError, endError)
            // }
            required={doesNotCurrentlyWorkHere}
            // error={toDateError}
          />
        </div>
        <Checkbox
          name="current-employment"
          label="My spouse currently works here"
          checked={employmentRecord.isCurrent || false}
          onValueChange={value =>
            handlers.handleCheckboxChange('isCurrent', value)
          }
        />
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
            type="button"
            id="submit"
            className="vads-u-width--auto"
            onClick={updateFormData}
          >
            {`${editIndex ? 'Update' : 'Add'} employment record`}
          </button>
        </p>
      </fieldset>
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
