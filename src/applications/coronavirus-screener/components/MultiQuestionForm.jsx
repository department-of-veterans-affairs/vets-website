import React, { useState, useEffect } from 'react';

import recordEvent from 'platform/monitoring/record-event';
import moment from 'moment';
import { isEqual } from 'lodash';
import FormResult from './FormResult';
import FormQuestion from './FormQuestion';
import {
  getEnabledQuestions,
  checkFormStatus,
  updateEnabledQuestions,
} from '../lib';

export default function MultiQuestionForm({
  questions,
  defaultOptions,
  customId,
  selectedLanguage,
  passFormResultsColors,
}) {
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
      let { completed } = formState;
      const newStatus = checkFormStatus({ questionState, customId });
      if (formState.status !== newStatus) {
        // record first completion of form
        if (completed === false) {
          recordEvent({
            event: 'covid-screening-tool-result-displayed',
            'screening-tool-result': newStatus,
            'time-to-complete': moment().unix() - formState.startTime,
          });
          completed = true;
        }
        setFormState({
          ...formState,
          status: newStatus,
          completed,
        });
      }
    },
    [questionState, formState],
  );

  // sets enabled status of questions in state
  // note: investigate https://reactjs.org/docs/hooks-reference.html#usereducer
  useEffect(
    () => {
      const newQuestionState = updateEnabledQuestions({
        questionState,
        customId,
      });
      if (!isEqual(newQuestionState, questionState)) {
        setQuestionState(newQuestionState);
      }
    },
    [questionState],
  );

  // records startTime and log to GA
  function recordStart(question) {
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
  }

  function setQuestionValue({ event, questionId }) {
    // sets the question value in question state
    const index = questionState.findIndex(
      question => question.id === questionId,
    );
    const newQuestionState = questionState;
    newQuestionState[index].value = event.target.value;
    setQuestionState([...newQuestionState]);
  }

  // removes value from every question after given questionId
  function clearQuestionValues(afterQuestionId) {
    const afterQuestionIndex = questionState.findIndex(
      question => question.id === afterQuestionId,
    );
    const newQuestionState = questionState.map((question, index) => {
      const returnQuestion = question;
      if (index > afterQuestionIndex) {
        delete returnQuestion.value;
      }
      return returnQuestion;
    });
    setQuestionState([...newQuestionState]);
  }

  const enabledQuestions = getEnabledQuestions({ questionState, customId });
  const formQuestions = enabledQuestions.map(
    (question, index) =>
      (index === 0 ||
        Object.hasOwnProperty.call(enabledQuestions[index - 1], 'value')) && (
        <FormQuestion
          question={question}
          recordStart={recordStart}
          optionsConfig={defaultOptions}
          setQuestionValue={setQuestionValue}
          clearQuestionValues={clearQuestionValues}
          key={`question-${question.id}`}
          selectedLanguage={selectedLanguage}
        />
      ),
  );

  return (
    // TODO: Rather than pass selectedLanguage around as a prop, write it to
    // state and then use it where it is needed.
    <div>
      {formQuestions}
      <FormResult
        formState={formState}
        selectedLanguage={selectedLanguage}
        passFormResultsColors={passFormResultsColors}
      />
    </div>
  );
}
