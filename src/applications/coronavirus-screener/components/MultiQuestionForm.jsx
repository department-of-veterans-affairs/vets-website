import React from 'react';
import FormQuestion from './FormQuestion';
import { Element, scroller } from 'react-scroll';
import FormResult from './FormResult';

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

  const formQuestions = questions.map((question, index) => (
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
        formState={formState}
        resultSubmitted={resultSubmitted}
        setResultSubmittedState={setResultSubmittedState}
      />
    </div>
  );
}
