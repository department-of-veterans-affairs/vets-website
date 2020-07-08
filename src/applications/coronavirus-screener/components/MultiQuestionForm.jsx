import React, { useState, useEffect } from 'react';
import FormQuestion from './FormQuestion';
import FormResult from './FormResult';
import recordEvent from 'platform/monitoring/record-event';
import moment from 'moment';
import _ from 'lodash/fp';
import {
  checkFormStatus,
  clearValuesAfter,
  getEnabledQuestions,
  updateEnabledQuestions,
} from '../lib';

export default function MultiQuestionForm({
  questions,
  defaultOptions,
  customId,
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
      let completed = formState.completed;
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
      if (!_.isEqual(newQuestionState, questionState)) {
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

  const enabledQuestions = getEnabledQuestions({ questionState, customId });

  function handleClearValuesAfter(questionId) {
    const newQuestionState = clearValuesAfter({
      questionId,
      questionState,
    });
    setQuestionState([...newQuestionState]);
  }

  const formQuestions = enabledQuestions.map(
    (question, index) =>
      (index === 0 || enabledQuestions[index - 1]?.value) && (
        <FormQuestion
          question={question}
          recordStart={recordStart}
          optionsConfig={defaultOptions}
          setQuestionValue={setQuestionValue}
          handleClearValuesAfter={handleClearValuesAfter}
          key={`question-${question.id}`}
        />
      ),
  );

  return (
    <div>
      {formQuestions}
      <FormResult formState={formState} />
    </div>
  );
}
