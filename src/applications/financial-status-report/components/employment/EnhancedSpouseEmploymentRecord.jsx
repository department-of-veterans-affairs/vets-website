import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  VaTextInput,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ButtonGroup from '../shared/ButtonGroup';
import {
  getJobIndex,
  getJobButton,
  jobButtonConstants,
  jobTypeConstants,
} from '../../utils/session';
import { BASE_EMPLOYMENT_RECORD } from '../../constants/index';

const RETURN_PATH = '/spouse-employment-history';

const EmploymentRecord = props => {
  const { data, goToPath, setFormData } = props;

  const editIndex = getJobIndex();

  const isEditing = editIndex && !Number.isNaN(editIndex);

  const index = isEditing ? Number(editIndex) : 0;

  const {
    personalData: {
      employmentHistory: {
        spouse: { spEmploymentRecords = [] } = {},
        newRecord = { ...BASE_EMPLOYMENT_RECORD },
      } = {},
    },
  } = data;

  const [employmentRecord, setEmploymentRecord] = useState({
    ...(isEditing ? spEmploymentRecords[index] : newRecord),
  });

  const [typeError, setTypeError] = useState(null);
  const [employerNameError, setEmployerNameError] = useState(false);

  const [currentlyWorksHere, setCurrentlyWorksHere] = useState(
    employmentRecord.isCurrent ?? true,
  );

  const handleChange = (key, value) => {
    if (key === 'type') {
      setTypeError(value === '' ? 'Please select your type of work.' : null);
    }
    setEmploymentRecord({
      ...employmentRecord,
      [key]: value,
    });
  };

  const handleEmployerNameChange = ({ target }) => {
    handleChange('employerName', target.value);
    setEmployerNameError(!target.value);
  };

  const userType = 'spouse';

  const updateFormData = e => {
    e.preventDefault();

    if (!employmentRecord.type || employmentRecord.type === '') {
      setTypeError('Please select your type of work.');
    }

    if (!employmentRecord.employerName) {
      setEmployerNameError(true);
    }

    if (employmentRecord.type === '' || employmentRecord.employerName === '') {
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

  const handlers = {
    onChange: event => {
      const { target = {} } = event;
      const fieldName = target.name;
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
    onRadioSelect: event => {
      const { value } = event?.detail || {};
      if (value === undefined) return;
      handleChange('isCurrent', value === 'true');
      setCurrentlyWorksHere(value === 'true');
    },
    getCancelButtonText: () => {
      if (getJobButton() === jobButtonConstants.FIRST_JOB) {
        return 'Back';
      }

      if (getJobButton() === jobButtonConstants.EDIT_JOB) {
        return 'Cancel edit entry';
      }
      return 'Cancel add entry';
    },
    onJobTypeRadioSelect: event => {
      const { value } = event?.detail || {};
      if (value === undefined) {
        setTypeError('Please select your type of work.');
        return;
      }
      handleChange('type', value);
    },
  };

  return (
    <form onSubmit={updateFormData}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Add a job</h3>
          <p className="vads-u-margin-bottom--neg1 vads-u-margin-top--3 vads-u-padding-bottom--0p25 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base">
            Tell us about any jobs your spouse had in the past 2 years that they
            received pay stubs for. You’ll need to provide their income
            information if it’s a current job.
          </p>
        </legend>
        <div className="input-size-7">
          <VaRadio
            class="vads-u-margin-y--2"
            label="Type of work"
            onVaValueChange={handlers.onJobTypeRadioSelect}
            required
            error={typeError}
          >
            <va-radio-option
              id="full-time"
              label={jobTypeConstants.FULL_TIME}
              value={jobTypeConstants.FULL_TIME}
              checked={employmentRecord.type === jobTypeConstants.FULL_TIME}
            />
            <va-radio-option
              id="part-time"
              label={jobTypeConstants.PART_TIME}
              value={jobTypeConstants.PART_TIME}
              checked={employmentRecord.type === jobTypeConstants.PART_TIME}
            />
            <va-radio-option
              id="seasonal"
              label={jobTypeConstants.SEASONAL}
              value={jobTypeConstants.SEASONAL}
              checked={employmentRecord.type === jobTypeConstants.SEASONAL}
            />
            <va-radio-option
              id="temporary"
              label={jobTypeConstants.TEMPORARY}
              value={jobTypeConstants.TEMPORARY}
              checked={employmentRecord.type === jobTypeConstants.TEMPORARY}
            />
          </VaRadio>
        </div>
        <div className="vads-u-margin-bottom--2">
          <VaTextInput
            error={employerNameError ? 'Please enter your employer name.' : ''}
            id="employer-name"
            label="Employer name"
            name="employer-name"
            onInput={handleEmployerNameChange}
            required
            type="text"
            value={employmentRecord.employerName}
            width="xl"
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

        <ButtonGroup
          buttons={[
            {
              label: handlers.getCancelButtonText(),
              onClick: handlers.onCancel,
              isSecondary: true,
            },
            {
              label: 'Continue',
              onClick: updateFormData,
              isSubmitting: 'prevent',
            },
          ]}
        />
      </fieldset>
    </form>
  );
};

EmploymentRecord.propTypes = {
  data: PropTypes.shape({
    personalData: PropTypes.shape({
      employmentHistory: PropTypes.shape({
        newRecord: PropTypes.shape({
          employerName: PropTypes.string,
          from: PropTypes.string,
          to: PropTypes.string,
          type: PropTypes.string,
          grossMonthlyIncome: PropTypes.string,
          deductions: PropTypes.array,
          isCurrent: PropTypes.bool,
        }),
        spouse: PropTypes.shape({
          spEmploymentRecords: PropTypes.arrayOf(
            PropTypes.shape({
              employerName: PropTypes.string,
              from: PropTypes.string,
              to: PropTypes.string,
              type: PropTypes.string,
              grossMonthlyIncome: PropTypes.string,
              deductions: PropTypes.array,
              isCurrent: PropTypes.bool,
            }),
          ),
        }),
      }),
    }),
  }).isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
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
