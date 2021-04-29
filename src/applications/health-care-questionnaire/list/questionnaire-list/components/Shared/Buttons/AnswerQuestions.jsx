import React, { useState } from 'react';
import moment from 'moment';

import { setSelectedAppointmentData } from '../../../../../shared/utils';
import { SecondaryActionLink } from '../../../../../shared/components/action-link';

export default function AnswerQuestions(props) {
  const {
    status,
    id,
    facilityName,
    appointmentTime,
    fullData,
    useActionLink,
  } = props;
  const [readyForRedirect, setReadyForRedirect] = useState(false);

  const onClick = () => {
    setSelectedAppointmentData(window, fullData);
    setReadyForRedirect(true);
  };

  if (readyForRedirect) {
    const destination = `/health-care/health-questionnaires/questionnaires/answer-questions?id=${id}`;
    window.location.replace(destination);
  }

  if (useActionLink) {
    return (
      <section className="action-link-container">
        <SecondaryActionLink
          testId="answer-button"
          ariaLabel={`Select to ${
            status ? 'continue' : 'start'
          } your pre-appointment questionnaire for your primary care visit at ${facilityName} on ${moment(
            appointmentTime,
          ).format('MMMM, D, YYYY')}`}
          onClick={onClick}
        >
          <span data-testid="button-text">
            {status ? 'Continue questions' : 'Answer questions'}
          </span>
        </SecondaryActionLink>
      </section>
    );
  }

  return (
    <button
      data-testid="answer-button"
      className="usa-button va-button answer-button"
      aria-label={`Select to ${
        status ? 'continue' : 'start'
      } your pre-appointment questionnaire for your primary care visit at ${facilityName} on ${moment(
        appointmentTime,
      ).format('MMMM, D, YYYY')}`}
      onClick={onClick}
    >
      <span data-testid="button-text">
        {status ? 'Continue questions' : 'Answer questions'}
      </span>
      <i className={`fa fa-chevron-right`} />
    </button>
  );
}
