/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import FormQuestion from './FormQuestion';
import { Element, scroller } from 'react-scroll';
import FormResult from './FormResult';
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

function checkFormStatus(questionState) {
  const completedQuestions = questionState.map(question =>
    Object.prototype.hasOwnProperty.call(question, 'answer'),
  );
  // console.log(completedQuestions);
  const complete = !completedQuestions.includes(false);
  // console.log(complete);

  if (complete) {
    return 'complete';
  } else {
    return 'incomplete';
  }
}

export default function MultiQuestionForm({ questions }) {
  const [formState, setFormState] = useState({
    status: 'incomplete',
    startTime: null,
  });

  const [questionState, setQuestionState] = useState(questions);

  // note: investigate https://reactjs.org/docs/hooks-reference.html#usereducer
  useEffect(
    () => {
      console.log('hook fired');
      console.log(formState);
      console.log(questionState);
      setFormState({
        ...formState,
        status: checkFormStatus(questionState),
      });
    },
    [questionState],
  );

  const formQuestions = Object.getOwnPropertyNames(questionState).map(
    (id, index) => (
      <div key={questionState.id}>
        <Element name={`multi-question-form-${index}-scroll-element`} />
        <FormQuestion
          question={questionState.id}
          formState={formState}
          setFormState={setFormState}
          questionState={questionState}
          setQuestionState={setQuestionState}
          scrollNext={() =>
            scrollTo(`multi-question-form-${index + 1}-scroll-element`)
          }
        />
      </div>
    ),
  );

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
