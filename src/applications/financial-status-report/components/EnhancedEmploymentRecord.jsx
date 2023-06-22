import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  VaSelect,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getJobIndex } from '../utils/session';
import { BASE_EMPLOYMENT_RECORD } from '../constants/index';

const RETURN_PATH = '/employment-history';

const EmploymentRecord = props => {
  const { data, goToPath, setFormData } = props;

  const editIndex = getJobIndex();

  const isEditing = editIndex && !Number.isNaN(editIndex);

  const index = isEditing ? Number(editIndex) : 0;

  const {
    personalData: {
      employmentHistory: {
        veteran: { employmentRecords = [] },
        newRecord = { ...BASE_EMPLOYMENT_RECORD },
      },
    },
  } = data;

  const [employmentRecord, setEmploymentRecord] = useState({
    ...(isEditing ? employmentRecords[index] : newRecord),
  });

  const [typeError, setTypeError] = useState('');
  const [employerNameError, setEmployerNameError] = useState(false);

  const [currentlyWorksHere, setCurrentlyWorksHere] = useState(
    employmentRecord.isCurrent ?? true,
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

  const userType = 'veteran';

  const updateFormData = e => {
    e.preventDefault();

    if (!employmentRecord.type || employmentRecord.type === '') {
      setTypeError('Please select your type of work.');
    }

    if (!employmentRecord.employerName) {
      setEmployerNameError(true);
      return;
    }
    setEmployerNameError(false);

    if (
      !employmentRecord.type ||
      employmentRecord.type === '' ||
      (!employmentRecord.employerName && employmentRecord.employerName !== '')
    ) {
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
    goToPath(`/employment-work-dates`);
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
      if (editIndex === null && employmentRecords.length === 0) {
        goToPath('/employment-question');
        return;
      }
      goToPath(RETURN_PATH);
    },
    handleDateChange: (key, monthYear) => {
      const dateString = `${monthYear}-XX`;
      handleChange(key, dateString);
    },
    onRadioSelect: event => {
      const { value } = event?.detail || {};
      if (value === undefined) return;
      handleChange('isCurrent', value === 'true');
      setCurrentlyWorksHere(value === 'true');
    },
  };

  return (
    <form onSubmit={updateFormData}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Add a job</h3>
        </legend>
        <p>
          Tell us about any jobs you’ve had in the past 2 years that you
          received pay stubs for. You’ll need to provide your income information
          if it’s a current job.
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
        <div className="input-size-7 vads-u-margin-bottom--2">
          <va-text-input
            label="Employer name"
            name="employerName"
            onInput={handleEmployerNameChange}
            value={employmentRecord.employerName}
            required
            error={employerNameError ? 'Please enter your employer name.' : ''}
          />
        </div>
        <VaRadio
          class="vads-u-margin-y--2"
          label="Do you currently work at this job?"
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
