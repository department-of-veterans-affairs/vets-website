import React from 'react';

export default function CustomReviewField({ children, uiSchema }) {
  let selectQuestionTitle = '';

  function whichSelectQuestions(term) {
    return children.props.name.includes(term);
  }
  switch (true) {
    case whichSelectQuestions('EMPLOYMENT_STATUS'):
      selectQuestionTitle = 'Employment status';
      break;
    case whichSelectQuestions('HEALTH_HISTORY'):
      selectQuestionTitle = 'Health history';
      break;
    case whichSelectQuestions('TRANSPORTATION'):
      selectQuestionTitle = 'Transportation';
      break;
    case whichSelectQuestions('GENDER'):
      selectQuestionTitle = 'Gender';
      break;
    case whichSelectQuestions('RACE_ETHNICITY_ORIGIN'):
      selectQuestionTitle = 'Race, ethnicity, and origin';
      break;
    default:
      selectQuestionTitle = '';
  }

  return children?.props.formData ? (
    <div>
      <div className="review-row">
        <dt>{selectQuestionTitle}:</dt>
        <dd>{uiSchema['ui:title']}</dd>
      </div>
    </div>
  ) : (
    ''
  );
}
