import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  VaButtonPair,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { QUESTION_CONTENT } from '../constants/question-data-map';

/**
 * Produces a set of 2-3 radio options
 * @param {string} formValue - The response for this question in the Redux store
 * @param {array[string]} responses - The responses available for this question
 * @param {string} shortName - Question short name (SNAKE_CASE)
 */
const RadioQuestion = ({ shortName }) => {
  const {
    descriptionText,
    h1,
    hintText,
    questionText,
    responses,
  } = QUESTION_CONTENT[shortName];
  let radios;

  const onContinueClick = () => {
    // TODO
  };

  const onBackClick = () => {
    // TODO
  };

  const onValueChange = () => {
    // TODO
  };

  const renderRadioOptions = () => {
    return responses.map((response, index) => {
      const [[shortAnswer, longAnswer]] = Object.entries(response);

      return (
        <VaRadioOption
          key={index}
          data-testid="va-radio-option"
          description={longAnswer}
          label={shortAnswer}
          name="group"
          tile
          value={shortAnswer}
        />
      );
    });
  };

  if (descriptionText) {
    radios = (
      <>
        <VaRadio
          class="vads-u-margin-top--0"
          data-testid={shortName}
          form-heading={h1}
          form-heading-level={1}
          hint={hintText}
          id="onramp-radio"
          label={questionText}
          onVaValueChange={e => onValueChange(e.detail.value)}
          required
          use-forms-pattern="single"
        >
          {renderRadioOptions()}
          <div className="vads-u-margin-bottom--3" slot="form-description">
            {descriptionText}
          </div>
        </VaRadio>
      </>
    );
  } else {
    radios = (
      <>
        <h1 className="vads-u-margin-bottom--3">{h1}</h1>
        <VaRadio
          class="vads-u-margin-top--0"
          data-testid={shortName}
          hint={hintText}
          id="onramp-radio"
          label={questionText}
          onVaValueChange={e => onValueChange(e.detail.value)}
          required
        >
          {renderRadioOptions()}
        </VaRadio>
      </>
    );
  }

  return (
    <>
      {radios}
      <VaButtonPair
        class="vads-u-margin-top--2"
        data-testid="onramp-buttonPair"
        onPrimaryClick={onContinueClick}
        onSecondaryClick={onBackClick}
        continue
      />
    </>
  );
};

RadioQuestion.propTypes = {
  h1: PropTypes.string.isRequired,
  shortName: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
  descriptionText: PropTypes.string,
  hintText: PropTypes.string,
  useSinglePattern: PropTypes.bool,
};

export default connect(null)(RadioQuestion);
