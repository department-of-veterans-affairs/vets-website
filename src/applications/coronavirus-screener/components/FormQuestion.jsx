import React, { useEffect } from 'react';
import classnames from 'classnames';
import { Element } from 'platform/utilities/scroll';
import { scrollerTo } from '../lib';

export default function FormQuestion({
  question,
  recordStart,
  optionsConfig,
  setQuestionValue,
  clearQuestionValues,
  selectedLanguage,
}) {
  const scrollElementName = `multi-question-form-${question.id}-scroll-element`;

  function handleClick(event) {
    recordStart(question.id);
    setQuestionValue({ event, questionId: question.id });
    if (question.clearValues ?? false) {
      clearQuestionValues(question.id);
    }
  }

  useEffect(() => {
    // do not scroll for first question
    if (question.startQuestion !== true) {
      scrollerTo(scrollElementName);
    }
  });

  const options = optionsConfig.map((option, index) => (
    <button
      key={index}
      type="button"
      className={classnames(
        'usa-button-big',
        (question.value === option.optionValue ? 'usa-button' : null) ?? [
          'usa-button-secondary',
          'vads-u-background-color--white', // TODO: resolve upstream design system bug https://github.com/department-of-veterans-affairs/va.gov-team/issues/9610
        ],
      )}
      onClick={handleClick}
      value={option.optionValue}
    >
      {option.optionText[selectedLanguage]}
    </button>
  ));

  return (
    <va-summary-box
      class="vads-u-margin-bottom--3"
      id={`question-${question.id}`}
    >
      <Element name={scrollElementName} />
      <h2 slot="headline">{question.text[selectedLanguage]}</h2>
      {options}
    </va-summary-box>
  );
}
