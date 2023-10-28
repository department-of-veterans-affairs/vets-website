import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  navigateBackward,
  navigateForward,
} from '../../utilities/page-navigation';
import { updateFormStore } from '../../actions';
import { cleanUpAnswers } from '../../utilities/answer-cleanup';

/**
 * Produces a set of 3 radio options
 * @param {string} formValue - The response for this question in the Redux store
 * @param {array[string]} responses - The responses available for this question
 * @param {string} shortName - Question short name (SNAKE_CASE)
 */
const TernaryRadios = ({
  formError,
  formResponses,
  formValue,
  h1,
  locationList,
  responses,
  router,
  setFormError,
  shortName,
  testId,
  updateCleanedFormStore,
  valueSetter,
}) => {
  const [valueHasChanged, setValueHasChanged] = useState(false);

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

  const onValueChange = value => {
    valueSetter(value);

    if (formValue) {
      setValueHasChanged(true);
    }

    if (value) {
      setFormError(false);
    }
  };

  return (
    <>
      <div
        className={
          formError
            ? 'vads-u-margin-bottom--3 form-question-error'
            : 'vads-u-margin-bottom--3'
        }
      >
        <h1 className="form-question-header" id="form-question">
          {h1}
        </h1>
        {locationList ? <div id="form-instructions">{locationList}</div> : null}
        <fieldset
          aria-labelledby="form-question form-instructions"
          data-testid={testId}
        >
          {formError && (
            <span className="usa-error-message" role="alert">
              <div className="form-text-error">
                <span className="usa-sr-only">Error</span> Select a response.
              </div>
            </span>
          )}
          <>
            <input
              type="radio"
              checked={formValue === responses[0]}
              data-testId="va-radio-option"
              id={_.snakeCase(`${responses[0]}_input`)}
              name={shortName}
              onChange={() => onValueChange(responses[0])}
              value={responses[0]}
            />
            <label
              className="form-label"
              htmlFor={_.snakeCase(`${responses[0]}_input`)}
            >
              <span>{responses[0]}</span>
            </label>
          </>
          <>
            <input
              type="radio"
              checked={formValue === responses[1]}
              data-testId="va-radio-option"
              id={_.snakeCase(`${responses[1]}_input`)}
              name={shortName}
              onChange={() => onValueChange(responses[1])}
              value={responses[1]}
            />
            <label
              className="form-label"
              htmlFor={_.snakeCase(`${responses[1]}_input`)}
            >
              <span>{responses[1]}</span>
            </label>
          </>
          <>
            <input
              type="radio"
              checked={formValue === responses[2]}
              data-testId="va-radio-option"
              id={_.snakeCase(`${responses[2]}_input`)}
              name={shortName}
              onChange={() => onValueChange(responses[2])}
              value={responses[2]}
            />
            <label
              className="form-label"
              htmlFor={_.snakeCase(`${responses[2]}_input`)}
            >
              <span>{responses[2]}</span>
            </label>
          </>
        </fieldset>
      </div>
      <VaButtonPair
        data-testid="paw-buttonPair"
        onPrimaryClick={onContinueClick}
        onSecondaryClick={onBackClick}
        continue
      />
    </>
  );
};

const mapDispatchToProps = {
  updateCleanedFormStore: updateFormStore,
};

TernaryRadios.propTypes = {
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
  formValue: PropTypes.string,
  locationList: PropTypes.node,
};

export default connect(
  null,
  mapDispatchToProps,
)(TernaryRadios);
