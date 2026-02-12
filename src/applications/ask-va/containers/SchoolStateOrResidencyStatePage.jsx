import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { states } from '@department-of-veterans-affairs/platform-forms/address';
import { focusElement } from 'platform/utilities/ui';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { CHAPTER_3 } from '../constants';

const isValid = formData =>
  formData.stateOrResidency?.schoolState ||
  formData.stateOrResidency?.residencyState;

const SchoolStateOrResidencyStateCustomPage = props => {
  const { id, onChange, goBack, formData, goForward } = props;
  const [validationError, setValidationError] = useState(false);

  const onContinue = data => {
    if (isValid(data)) {
      goForward(data);
    } else {
      focusElement('#school-state-res-state');
      setValidationError(true);
    }
  };

  const handleChange = event => {
    const selectedValue = event.detail.value;
    const selectName = event.target.name;

    const stateOrResidency = {
      ...formData.stateOrResidency,
      [selectName]: selectedValue,
    };

    const newFormData = {
      ...formData,
      stateOrResidency,
      stateOfTheSchool: null,
    };
    const isError = !isValid(newFormData);
    setValidationError(isError);
    onChange(newFormData);
  };

  return (
    <>
      <form className="rjsf">
        <div
          className={`vads-u-margin-bottom--4 ${validationError &&
            'school-state-error'}`}
        >
          <fieldset id="school-state-res-state" className="rjsf-object-field">
            <legend
              className="schemaform-block-title schemaform-block-subtitle usa-legend vads-u-display--flex"
              part="legend"
            >
              <h3 className="vads-u-margin-top--0">
                {CHAPTER_3.SCHOOL_STATE_OR_RESIDENCY.TITLE}
              </h3>{' '}
              &nbsp;
              <span
                className="usa-label--required vads-u-color--secondary vads-u-font-weight--normal vads-u-font-family--sans"
                part="required"
              >
                (*Required)
              </span>
            </legend>
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--4">
              {CHAPTER_3.SCHOOL_STATE_OR_RESIDENCY.QUESTION_1}
            </p>
            {validationError && (
              <span
                role="alert"
                className="usa-input-error-message vads-u-margin-bottom--3"
                id="root_subject-error-message"
              >
                <span className="sr-only">Error</span> Select school state or
                residency state
              </span>
            )}
            <VaSelect
              id={id}
              name="schoolState"
              showError={validationError}
              error={validationError ? ' ' : ''}
              value={formData.stateOrResidency?.schoolState}
              onVaSelect={handleChange}
              label="School state"
              hint="This is the state where your school is located."
            >
              {states.USA.map(state => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </VaSelect>

            <VaSelect
              className="vads-u-margin-top--4"
              id={id}
              name="residencyState"
              showError={validationError}
              error={validationError ? ' ' : ''}
              value={formData.stateOrResidency?.residencyState}
              onVaSelect={handleChange}
              label="Residency state"
              hint="This is the state where you currently live."
            >
              {states.USA.map(state => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </VaSelect>
          </fieldset>
        </div>

        {!props.onReviewPage && (
          <FormNavButtons
            className="vads-u-margin-top--3"
            goBack={goBack}
            goForward={() => onContinue(formData)}
          />
        )}
      </form>
    </>
  );
};

SchoolStateOrResidencyStateCustomPage.propTypes = {
  formData: PropTypes.shape({
    stateOrResidency: PropTypes.shape({
      schoolState: PropTypes.string,
      residencyState: PropTypes.string,
    }),
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  id: PropTypes.string,
  onChange: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    formData: state.form.data,
  };
}

export default connect(mapStateToProps)(SchoolStateOrResidencyStateCustomPage);
