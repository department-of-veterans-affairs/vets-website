import React, { useState, useEffect } from 'react';
import { Element } from 'react-scroll';
import FormQuestion from './FormQuestion';
import FormResult from './FormResult';
import recordEvent from 'platform/monitoring/record-event';
import moment from 'moment';
import _ from 'lodash/fp';
import { getEnabledQuestions, checkFormStatus, scrollTo } from '../lib';

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
      let completed = formState.completed;
      const newStatus = checkFormStatus(questionState);
      if (formState.status !== newStatus) {
        // record first completion of form
        if (completed === false) {
          recordEvent({
            event: 'covid-screening-tool-result-displayed',
            'screening-tool-result': formState.result,
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

  const formQuestions = enabledQuestions.map((question, index) => (
    <div key={`question-${index}`}>
      <Element name={`multi-question-form-${index}-scroll-element`} />
      <FormQuestion
        question={question}
        scrollNext={() =>
          scrollTo(`multi-question-form-${index + 1}-scroll-element`)
        }
        recordStart={recordStart}
        optionsConfig={defaultOptions}
        setQuestionValue={setQuestionValue}
        clearQuestionValues={clearQuestionValues}
        visible={
          index === 0 ||
          Object.hasOwnProperty.call(questionState[index - 1], 'value')
        }
      />
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
