import React from 'react';
import moment from 'moment';

export default function AnswerQuestions(props) {
  const { status, id, facilityName, appointmentTime } = props;
  return (
    <a
      className="usa-button va-button answer-button"
      href={`/health-care/health-questionnaires/questionnaires/answer-questions?id=${id}`}
      aria-label={`Fill out your pre-appointment questionnaire for your primary care visit at ${facilityName} on ${moment(
        appointmentTime,
      ).format('MMMM, D, YYYY')}`}
    >
      <span data-testid="button-text">
        {status ? 'Continue questions' : 'Answer questions'}
      </span>
      <i className={`fa fa-chevron-right`} />
    </a>
  );
}
