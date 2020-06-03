/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { Element, scroller } from 'react-scroll';
import FormQuestion from './FormQuestion';
import FormResult from './FormResult';
import recordEvent from 'platform/monitoring/record-event';
import moment from 'moment';
import _ from 'lodash/fp';

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

function getEnabledQuestions(questionState) {
  return questionState.filter(question => question.enabled ?? true);
}

// check if all enabled questions have been answered
function checkFormComplete(questionState) {
  const completedQuestions = getEnabledQuestions(questionState).map(question =>
    Object.prototype.hasOwnProperty.call(question, 'value'),
  );
  return !completedQuestions.includes(false);
}

// check result of answers
function checkFormResult(questionState) {
  return getEnabledQuestions(questionState)
    .map(question => {
      const passValues = question.passValues ?? ['no'];
      return passValues.contains(question.value);
    })
    .includes(false)
    ? 'fail'
    : 'pass';
}

// check the overall status of the form
function checkFormStatus(questionState) {
  return !checkFormComplete(questionState)
    ? 'incomplete'
    : checkFormResult(questionState);
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

  function checkEnabled(question) {
    if (Object.hasOwnProperty.call(question, 'dependsOn')) {
      const dependsOnQuestion = questionState.find(
        el => el.id === question.dependsOn.id,
      );
      const match = dependsOnQuestion.value === question.dependsOn.value;
      return { ...question, enabled: match };
    } else return question;
  }

  // sets enabled status of questions in state
  // note: investigate https://reactjs.org/docs/hooks-reference.html#usereducer
  useEffect(
    () => {
      const newQuestionState = questionState.map(question =>
        checkEnabled(question),
      );
      if (!_.isEqual(newQuestionState, questionState)) {
        setQuestionState(newQuestionState);
      }
    },
    [questionState],
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

  const enabledQuestions = getEnabledQuestions(questionState);

  function setQuestionValue({ event, questionId }) {
    // sets the question value in question state
    const index = questionState.findIndex(
      question => question.id === questionId,
    );
    const newQuestionState = questionState;
    newQuestionState[index].value = event.target.value;
    setQuestionState([...newQuestionState]);
  }

  const formQuestions = enabledQuestions.map((question, index) => (
    <div key={`question-${index}`}>
      <Element name={`multi-question-form-${index}-scroll-element`} />
      {(index === 0 ||
        Object.hasOwnProperty.call(questionState[index - 1], 'value')) && (
        <FormQuestion
          question={question}
          recordStart={recordStart}
          setQuestionValue={setQuestionValue}
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
        scrollIndex={enabledQuestions.length}
      />
    </div>
  );
}
