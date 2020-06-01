/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import FormQuestion from './FormQuestion';
import { Element, scroller } from 'react-scroll';
import FormResult from './FormResult';
import _ from 'lodash/fp';
import recordEvent from 'platform/monitoring/record-event';
import moment from 'moment';

// scoller usage based on https://github.com/department-of-veterans-affairs/veteran-facing-services-tools/blob/master/packages/formation-react/src/components/CollapsiblePanel/CollapsiblePanel.jsx

function scrollTo(name) {
  scroller.scrollTo(
    name,
    window.VetsGov.scroll || {
      duration: 500,
      delay: 2,
      smooth: true,
    },
  );
}

function checkFormStatus(questionState) {
  // check if all questions have been answered
  const completedQuestions = questionState.map(question =>
    Object.prototype.hasOwnProperty.call(question, 'value'),
  );
  const complete = !completedQuestions.includes(false);

  // determine result of form
  if (!complete) {
    return 'incomplete';
  } else {
    const answers = questionState.map(question => question.value);
    return answers.includes('yes') ? 'fail' : 'pass';
  }
}

function recordCompletion({ formState, setFormState }) {
  if (formState.status !== 'incomplete' && formState.completed === false) {
    recordEvent({
      event: 'covid-screening-tool-result-displayed',
      'screening-tool-result': formState.result,
      'time-to-complete': moment().unix() - formState.startTime,
    });
    setFormState({ ...formState, completed: true });
  }
}

export default function MultiQuestionForm({ questions, defaultOptions }) {
  const [formState, setFormState] = useState({
    status: 'incomplete',
    startTime: null,
    completed: false,
  });

  const [questionState, setQuestionState] = useState(questions);

  // updates formState based on questionState
  // note: investigate https://reactjs.org/docs/hooks-reference.html#usereducer
  useEffect(
    () => {
      console.log('questionState', questionState);

      if (formState.status !== checkFormStatus(questionState)) {
        setFormState({
          ...formState,
          status: checkFormStatus(questionState),
        });
        recordCompletion({ formState, setFormState });
      }

      console.log('formState', formState);
    },
    [questionState, formState],
  );

  // records startTime and log to GA
  const recordStart = question => {
    if (formState.startTime === null) {
      recordEvent({
        event: 'covid-screening-tool-start',
        'screening-tool-question': question.id,
      });
      // starts duration timer for GA
      setFormState({
        ...formState,
        startTime: moment().unix(),
      });
    }
  };

  const formQuestions = questionState.map((question, index) => (
    <div key={`question-${index}`}>
      <Element name={`multi-question-form-${index}-scroll-element`} />
      {(index === 0 ||
        Object.hasOwnProperty.call(questionState[index - 1], 'value')) && (
        <FormQuestion
          question={question}
          questionIndex={index}
          questionState={questionState}
          setQuestionState={setQuestionState}
          recordStart={recordStart}
          scrollNext={() =>
            scrollTo(`multi-question-form-${index + 1}-scroll-element`)
          }
          optionsConfig={defaultOptions}
        />
      )}
    </div>
  ));

  return (
    <div>
      {formQuestions}
      <FormResult
        formState={formState}
        setFormState={setFormState}
        questionState={questionState}
      />
    </div>
  );
}
