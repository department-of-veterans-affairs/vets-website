import React, { useState } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import {
  VaSelect,
  VaDate,
  VaTextInput,
  VaCheckbox,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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

  const index = Number(idSchema.$id.slice(-1));
  const { userType, userArray } = uiSchema['ui:options'];
  const { employmentRecords } = employmentHistory[`${userType}`];
  const employment = employmentRecords || defaultRecord;
  const { from, to } = employment ? employment[index] : [];
  const { month: fromMonth, year: fromYear } = parseISODate(from);
  const { month: toMonth, year: toYear } = parseISODate(to);
  const { submitted } = formContext;

  const [employerName, setEmployerName] = useState(
    employment[index].employerName || null,
  );

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

  const handleEmployerNameChange = event => {
    handleChange('employerName', event.target.value);
    setEmployerName(event.target.value);
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

  // check field for validation errors only if field is dirty or form has been submitted
  const showError = () => {
    return submitted && !employment[index].type
      ? 'Please select a type of employment'
      : false;
  };

  return (
    <>
      <div className="input-size-5">
        <VaSelect
          name="type"
          data-test-id="employment-type"
          label="Type of work"
          required
          value={employment[index].type || []}
          onVaSelect={e => handleChange('type', e.detail.value)}
          error={showError() || null}
          uswds
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
          onDateChange={e => handleDateChange('from', e.target.value)}
          onDateBlur={e =>
            validateYear(e.target.value || '', setFromDateError, startError)
          }
          required
          error={fromDateError}
          uswds
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
          uswds
        />
      </div>
      <VaCheckbox
        name="current-employment"
        label="I currently work here"
        checked={employment[index].isCurrent || false}
        onVaChange={event =>
          handleCheckboxChange('isCurrent', event.detail.checked)
        }
        uswds
      />
      <div className="input-size-6 vads-u-margin-bottom--2">
        <VaTextInput
          className="no-wrap input-size-6"
          error={(submitted && employerError) || null}
          label="Employer name"
          name="employerName"
          onInput={handleEmployerNameChange}
          required
          type="text"
          value={employerName || ''}
          uswds
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
