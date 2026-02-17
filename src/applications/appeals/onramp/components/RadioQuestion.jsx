import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  VaButtonPair,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import {
  QUESTION_CONTENT,
  SHORT_NAME_MAP,
} from '../constants/question-data-map';
import {
  updateFormStore,
  updateQuestionValue,
  updateResultsPage,
} from '../actions';
import { cleanUpAnswers } from '../utilities/answer-storage';
import { navigateForward } from '../utilities/page-navigation';

export const QUESTION_STANDARD_ERROR = `Choose yes or no`;
export const QUESTION_DECISION_TYPE_ERROR = `Choose the type of decision`;

export const QUESTION_STANDARD_LABEL = 'Select one';
export const QUESTION_DECISION_TYPE_LABEL =
  'Select the type of claim or appeal that we previously sent you a decision on.';

/**
 * Produces a set of 2-3 radio options
 * @param {string} shortName - Question short name (SNAKE_CASE)
 */
const RadioQuestion = ({
  allQuestionShortNames,
  allResultsShortNames,
  formResponses,
  router,
  setQuestionValue,
  shortName,
  updateCleanedFormStore,
  updateResultsPageValue,
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

  if (formResponse && formError) {
    setFormError(false);
  }

  const onContinueClick = () => {
    if (!formResponse) {
      setFormError(true);
      focusElement(radioRef.current);

      return;
    }

    if (valueHasChanged) {
      // Remove answers from the Redux store if the display path ahead has changed
      cleanUpAnswers(allQuestionShortNames, updateCleanedFormStore, shortName);
    }

    navigateForward(
      allQuestionShortNames,
      allResultsShortNames,
      shortName,
      formResponses,
      router,
      updateResultsPageValue,
    );
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

  const errorMessage =
    shortName === SHORT_NAME_MAP.Q_2_0_CLAIM_TYPE
      ? QUESTION_DECISION_TYPE_ERROR
      : QUESTION_STANDARD_ERROR;

  const radioLabel =
    shortName === SHORT_NAME_MAP.Q_2_0_CLAIM_TYPE
      ? QUESTION_DECISION_TYPE_LABEL
      : QUESTION_STANDARD_LABEL;

  return (
    <>
      <VaRadio
        class="vads-u-margin-top--0"
        data-testid={shortName}
        error={formError ? errorMessage : null}
        form-heading={h1}
        form-heading-level={1}
        hint={hintText || null}
        id="onramp-radio"
        label={radioLabel}
        onVaValueChange={e => onValueChange(e.detail.value)}
        required
        use-forms-pattern="single"
      >
        {renderRadioOptions()}
        <div className="vads-u-margin-bottom--3" slot="form-description">
          <p className="vads-u-margin-y--0 vads-u-font-size--h3">
            Explore disability claim decision review options
          </p>
          <h2 className="vads-u-margin-y--2p5">{questionText}</h2>
          {descriptionText || null}
        </div>
      </VaRadio>
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
  allResultsShortNames: state?.decisionReviewsGuide?.allResultsShortNames,
  formResponses: state?.decisionReviewsGuide?.form,
});

const mapDispatchToProps = {
  setQuestionValue: updateQuestionValue,
  updateCleanedFormStore: updateFormStore,
  updateResultsPageValue: updateResultsPage,
};

RadioQuestion.propTypes = {
  allQuestionShortNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  allResultsShortNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  formResponses: PropTypes.object.isRequired,
  router: PropTypes.shape({
    goBack: PropTypes.func,
    push: PropTypes.func,
  }).isRequired,
  setQuestionValue: PropTypes.func.isRequired,
  shortName: PropTypes.string.isRequired,
  updateCleanedFormStore: PropTypes.func.isRequired,
  updateResultsPageValue: PropTypes.func.isRequired,
  descriptionText: PropTypes.string,
  hintText: PropTypes.string,
  useSinglePattern: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RadioQuestion);
