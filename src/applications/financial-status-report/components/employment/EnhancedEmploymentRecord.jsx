import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  VaSelect,
  VaTextInput,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  getJobIndex,
  getJobButton,
  jobButtonConstants,
} from '../../utils/session';
import { BASE_EMPLOYMENT_RECORD } from '../../constants/index';
import ButtonGroup from '../shared/ButtonGroup';

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

  const userType = 'veteran';

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
    onRadioSelect: event => {
      const { value } = event?.detail || {};
      if (value === undefined) return;
      handleChange('isCurrent', value === 'true');
      setCurrentlyWorksHere(value === 'true');
    },
    getContinueButtonText: () => {
      if (
        employmentRecord.isCurrent ||
        getJobButton() === jobButtonConstants.FIRST_JOB
      ) {
        return 'Continue';
      }

      if (getJobButton() === jobButtonConstants.EDIT_JOB) {
        return 'Update employment record';
      }
      return 'Add employment record';
    },
    getCancelButtonText: () => {
      if (getJobButton() === jobButtonConstants.FIRST_JOB) {
        return 'Back';
      }

      if (getJobButton() === jobButtonConstants.EDIT_JOB) {
        return 'Cancel Edit Entry';
      }
      return 'Cancel Add Entry';
    },
  };

  return (
    <form onSubmit={updateFormData}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Add a job</h3>
          <p className="vads-u-margin-bottom--neg1 vads-u-margin-top--3 vads-u-padding-bottom--0p25 vads-u-font-family--sans vads-u-font-weight--normal vads-u-font-size--base">
            Tell us about any jobs you’ve had in the past 2 years that you
            received pay stubs for. You’ll need to provide your income
            information if it’s a current job.
          </p>
        </legend>
        <div className="input-size-5">
          <VaSelect
            id="type"
            name="type"
            label="Type of work"
            required
            value={employmentRecord.type}
            onVaSelect={handlers.onChange}
            error={typeError}
            uswds
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
            error={employerNameError ? 'Please enter your employer name.' : ''}
            id="employer-name"
            label="Employer name"
            name="employerName"
            onInput={handleEmployerNameChange}
            required
            type="text"
            value={employmentRecord.employerName}
            uswds
          />
        </div>
        <VaRadio
          class="vads-u-margin-y--2"
          label="Do you currently work at this job?"
          onVaValueChange={handlers.onRadioSelect}
          required
          uswds
        >
          <va-radio-option
            id="works-here"
            label="Yes"
            value="true"
            checked={currentlyWorksHere}
            uswds
          />
          <va-radio-option
            id="does-not-work-here"
            label="No"
            value="false"
            name="primary"
            checked={!currentlyWorksHere}
            uswds
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
              isSubmitting: true,
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
        veteran: PropTypes.shape({
          employmentRecords: PropTypes.arrayOf(
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
