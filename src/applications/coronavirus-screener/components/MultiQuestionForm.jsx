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

  // console.log(completedQuestions);
  // console.log(complete);

  if (complete) {
    return 'pass';
  } else {
    return 'incomplete';
  }
}

export default function MultiQuestionForm({ questions, defaultOptions }) {
  const [formState, setFormState] = useState({
    status: 'incomplete',
    startTime: null,
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
    </div>
  ));

  return (
    <div>
      {formQuestions}
      <FormResult
        questions={questions}
        formState={formState}
        setFormState={setFormState}
        questionState={questionState}
        setQuestionState={setQuestionState}
      />
    </div>
  );
}
