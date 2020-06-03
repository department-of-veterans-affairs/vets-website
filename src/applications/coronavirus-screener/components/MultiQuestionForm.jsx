import React from 'react';
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

export default function MultiQuestionForm({ questions }) {
  const [formState, setFormState] = React.useState({});

  const [resultSubmitted, setResultSubmittedState] = React.useState({
    isSubmitted: false,
  });
  let filteredQuestions;

  if (_.isEmpty(formState)) {
    filteredQuestions = questions.filter(question => question.id === 'isStaff');
  } else {
    const scope = formState.isStaff === 'no' ? 'veteran' : 'staff';
    filteredQuestions = questions.filter(
      question => question.scope === scope || question.scope === 'both',
    );
  }

  const formQuestions = filteredQuestions.map((question, index) => (
    <div key={question.id}>
      <Element name={`multi-question-form-${index}-scroll-element`} />
      <FormQuestion
        question={question}
        setFormState={setFormState}
        formState={formState}
        resultSubmitted={resultSubmitted}
        setResultSubmittedState={setResultSubmittedState}
        scrollNext={() =>
          scrollTo(`multi-question-form-${index + 1}-scroll-element`)
        }
      />
    </div>
  ));

  return (
    <div>
      {formQuestions}
      <FormResult
        questions={filteredQuestions}
        formState={formState}
        resultSubmitted={resultSubmitted}
        setResultSubmittedState={setResultSubmittedState}
      />
    </div>
  );
}
