import React from 'react';
import PropTypes from 'prop-types';
import {
  VaButtonPair,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * Produces a set of 3 radio options
 * @param {string} formValue - The response for this question in the Redux store
 * @param {array[string]} responses - The responses available for this question
 * @param {string} shortName - Question short name (SNAKE_CASE)
 */
const TernaryRadios = ({
  formError,
  formValue,
  h1,
  locationList,
  onBackClick,
  onBlurInput,
  onContinueClick,
  onValueChange,
  responses,
  shortName,
  testId,
}) => {
  return (
    <>
      <VaRadio
        data-testid={testId}
        onBlur={onBlurInput}
        className="vads-u-margin-bottom--3"
        error={(formError && 'TBD error message') || null}
        hint=""
        label={h1}
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

TernaryRadios.propTypes = {
  formError: PropTypes.bool.isRequired,
  h1: PropTypes.string.isRequired,
  responses: PropTypes.arrayOf(PropTypes.string).isRequired,
  shortName: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
  onBackClick: PropTypes.func.isRequired,
  onBlurInput: PropTypes.func.isRequired,
  onContinueClick: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  formValue: PropTypes.string,
  locationList: PropTypes.node,
};

export default TernaryRadios;
