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

  const formQuestions = questions.map((question, index) => (
    <>
      <Element name={`multi-question-form-${index}-scroll-element`} />
      <FormQuestion
        key={question.id}
        question={question}
        value={formState[question.id]}
        setFormState={setFormState}
        state={formState}
        scrollNext={() =>
          scrollTo(`multi-question-form-${index + 1}-scroll-element`)
        }
      />
    </>
  ));

  return (
    <div>
      {formQuestions}
      <FormResult formState={formState} />
      {console.log(formState)}
    </div>
  );
}
