import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  VaButtonPair,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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

  const onBlurInput = () => {
    if (formValue) {
      setFormError(false);
    }
  };

  const onValueChange = event => {
    const { value } = event?.detail;
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
      <VaRadio
        data-testid={testId}
        onBlur={onBlurInput}
        className="vads-u-margin-bottom--3"
        error={(formError && 'Select a response.') || null}
        hint=""
        label={h1}
        label-header-level="1"
        onVaValueChange={onValueChange}
      >
        {locationList}
        <VaRadioOption
          checked={formValue === responses[0]}
          label={responses[0]}
          name={shortName}
          value={responses[0]}
        />
        <VaRadioOption
          checked={formValue === responses[1]}
          label={responses[1]}
          name={shortName}
          value={responses[1]}
        />
        <VaRadioOption
          checked={formValue === responses[2]}
          label={responses[2]}
          name={shortName}
          value={responses[2]}
        />
      </VaRadio>
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
