import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  VaSelect,
  VaTextInput,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getJobIndex } from '../utils/session';
import { BASE_EMPLOYMENT_RECORD } from '../constants/index';

const RETURN_PATH = '/spouse-employment-history';

const EmploymentRecord = props => {
  const { data, goToPath, setFormData } = props;

  const editIndex = getJobIndex();

  const isEditing = editIndex && !Number.isNaN(editIndex);

  const index = isEditing ? Number(editIndex) : 0;

  const {
    personalData: {
      employmentHistory: {
        spouse: { spEmploymentRecords = [] },
        newRecord = { ...BASE_EMPLOYMENT_RECORD },
      },
    },
  } = data;

  const [employmentRecord, setEmploymentRecord] = useState({
    ...(isEditing ? spEmploymentRecords[index] : newRecord),
  });
  const [employerName, setEmployerName] = useState(
    employmentRecord.employerName || null,
  );
  const [currentlyWorksHere, setCurrentlyWorksHere] = useState(
    employmentRecord.isCurrent ?? true,
  );
  const [submitted, setSubmitted] = useState(false);

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
      setFormData({
        ...data,
        personalData: {
          ...data.personalData,
          employmentHistory: {
            ...data.personalData.employmentHistory,
            newRecord: { ...BASE_EMPLOYMENT_RECORD },
          },
        },
      });
      if (editIndex === null && spEmploymentRecords.length === 0) {
        goToPath('/enhanced-spouse-employment-question');
        return;
      }
      goToPath(RETURN_PATH);
    },
    handleDateChange: (key, monthYear) => {
      const dateString = `${monthYear}-XX`;
      handleChange(key, dateString);
    },
    handleCheckboxChange: (key, val) => {
      setEmploymentRecord({
        ...employmentRecord,
        [key]: val,
        to: '',
      });
    },
    onRadioSelect: event => {
      const { value } = event?.detail || {};
      if (value === undefined) return;
      handleChange('isCurrent', value === 'true');
      setCurrentlyWorksHere(value === 'true');
    },
  };

  const [typeError, setTypeError] = useState('');

  const userType = 'spouse';

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
    } else {
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
    }
    goToPath('/spouse-employment-work-dates');
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
        <VaRadio
          class="vads-u-margin-y--2"
          label="Does your spouse currently work at this job?"
          onVaValueChange={handlers.onRadioSelect}
          required
        >
          <va-radio-option
            id="works-here"
            label="Yes"
            value="true"
            checked={currentlyWorksHere}
          />
          <va-radio-option
            id="does-not-work-here"
            label="No"
            value="false"
            name="primary"
            checked={!currentlyWorksHere}
          />
        </VaRadio>
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
