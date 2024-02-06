import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  VaButtonPair,
  VaCheckbox,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  navigateBackward,
  navigateForward,
} from '../../utilities/page-navigation';
import { updateFormStore } from '../../actions';
import { cleanUpAnswers } from '../../utilities/answer-cleanup';

/**
 * Produces a variable group of checkboxes
 * @param {string} formValue - The response for this question in the Redux store
 * @param {array[string]} responses - The responses available for this question
 * @param {string} shortName - Question short name (SNAKE_CASE)
 */
const CheckboxGroup = ({
  formError,
  formResponses,
  formValue,
  h1,
  responses,
  router,
  setFormError,
  shortName,
  testId,
  updateCleanedFormStore,
  valueSetter,
}) => {
  const [valueHasChanged, setValueHasChanged] = useState(false);

  const onValueChange = event => {
    const { value } = event?.target;
    valueSetter(value);

    if (formValue) {
      setValueHasChanged(true);
    }

    if (value) {
      setFormError(false);
    }
  };

  const createCheckboxes = () => {
    return responses.map(response => {
      return (
        <VaCheckbox
          checked={formValue?.includes(response)}
          key={response}
          label={response}
          name={shortName}
          value={response}
          onVaChange={onValueChange}
        />
      );
    });
  };

  const onContinueClick = () => {
    if (!formValue) {
      setFormError(true);
    } else {
      if (valueHasChanged) {
        // Remove answers from the Redux store if the display path ahead has changed
        cleanUpAnswers(formResponses, updateCleanedFormStore, shortName);
      }

      setFormError(false);
      navigateForward(shortName, formResponses, router);
    }
  };

  const onBackClick = () => {
    navigateBackward(shortName, formResponses, router);
  };

  return (
    <>
      <div
        className={classNames('vads-u-margin-bottom--3', {
          'pact-act-form-question-error': formError,
        })}
      >
        <h1
          className="pact-act-form-question-header"
          id="pact-act-form-question"
        >
          {h1}
        </h1>
        <fieldset
          aria-labelledby="pact-act-form-question pact-act-form-instructions"
          data-testid={testId}
        >
          {formError && (
            <span className="usa-error-message" role="alert">
              <div className="pact-act-form-text-error">
                <span className="usa-sr-only">Error</span> Select a location.
              </div>
            </span>
          )}
          <p id="pact-act-form-instructions">Select all that apply.</p>
          {createCheckboxes()}
        </fieldset>
      </div>
      <VaButtonPair
        data-testid="paw-buttonPair"
        onPrimaryClick={onContinueClick}
        onSecondaryClick={onBackClick}
        continue
        uswds={false}
      />
    </>
  );
};

const mapDispatchToProps = {
  updateCleanedFormStore: updateFormStore,
};

CheckboxGroup.propTypes = {
  formError: PropTypes.bool.isRequired,
  formResponses: PropTypes.object.isRequired,
  h1: PropTypes.string.isRequired,
  responses: PropTypes.arrayOf(PropTypes.string).isRequired,
  router: PropTypes.object.isRequired,
  setFormError: PropTypes.func.isRequired,
  shortName: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
  updateCleanedFormStore: PropTypes.func.isRequired,
  valueSetter: PropTypes.func.isRequired,
  formValue: PropTypes.array,
  locationList: PropTypes.node,
};

export default connect(
  null,
  mapDispatchToProps,
)(CheckboxGroup);
