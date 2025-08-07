import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  VaButtonPair,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { QUESTION_CONTENT } from '../constants/question-data-map';
import { updateFormStore, updateQuestionValue } from '../actions';
import { cleanUpAnswers } from '../utilities/answer-storage';
import { navigateForward } from '../utilities/page-navigation';

/**
 * Produces a set of 2-3 radio options
 * @param {string} shortName - Question short name (SNAKE_CASE)
 */
const RadioQuestion = ({
  allQuestionShortNames,
  formResponses,
  router,
  setQuestionValue,
  shortName,
  updateCleanedFormStore,
}) => {
  const {
    descriptionText,
    h1,
    hintText,
    questionText,
    responses,
  } = QUESTION_CONTENT[shortName];
  const [formError, setFormError] = useState(false);
  const [valueHasChanged, setValueHasChanged] = useState(false);
  const radioRef = useRef(null);
  const formResponse = formResponses?.[shortName];
  let radios;

  const onContinueClick = () => {
    if (!formResponse) {
      setFormError(true);
      focusElement(radioRef.current);
    }

    if (valueHasChanged) {
      // Remove answers from the Redux store if the display path ahead has changed
      cleanUpAnswers(allQuestionShortNames, updateCleanedFormStore, shortName);
    }

    if (formError) {
      setFormError(false);
    }

    navigateForward(allQuestionShortNames, shortName, formResponses, router);
  };

  const onValueChange = value => {
    setQuestionValue(shortName, value);

    if (formResponse && formResponse !== value) {
      setValueHasChanged(true);
    }

    if (value && formError) {
      setFormError(false);
    }
  };

  const renderRadioOptions = () => {
    return responses.map((response, index) => {
      const [[shortAnswer, longAnswer]] = Object.entries(response);

      return (
        <VaRadioOption
          key={index}
          checked={formResponse === shortAnswer}
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
          error={formError ? 'Placeholder error message' : null}
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
        onSecondaryClick={router.goBack}
        continue
      />
    </>
  );
};

const mapStateToProps = state => ({
  allQuestionShortNames: state?.decisionReviewsGuide?.allQuestionShortNames,
  formResponses: state?.decisionReviewsGuide?.form,
});

const mapDispatchToProps = {
  setQuestionValue: updateQuestionValue,
  updateCleanedFormStore: updateFormStore,
};

RadioQuestion.propTypes = {
  allQuestionShortNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  formResponses: PropTypes.object.isRequired,
  router: PropTypes.shape({
    goBack: PropTypes.func,
    push: PropTypes.func,
  }).isRequired,
  setQuestionValue: PropTypes.func.isRequired,
  shortName: PropTypes.string.isRequired,
  updateCleanedFormStore: PropTypes.func.isRequired,
  descriptionText: PropTypes.string,
  hintText: PropTypes.string,
  useSinglePattern: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RadioQuestion);
