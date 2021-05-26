import React from 'react';
import moment from 'moment-timezone';

import AnswerQuestions from '../Shared/Buttons/AnswerQuestions';
import PrintButton from '../../../../shared/components/print/PrintButton';
import { isAppointmentCancelled } from '../../../utils';
import {
  appointmentSelector,
  questionnaireResponseSelector,
  organizationSelector,
} from '../../../../shared/utils/selectors';

import QuestionnaireItem from '../QuestionnaireItem';

export default function ToDoQuestionnaireItem({ data }) {
  const { appointment, questionnaire, organization } = data;
  const appointmentStatus = appointmentSelector.getStatus(appointment);
  const isCancelled = isAppointmentCancelled(appointmentStatus);

  const facilityName = organizationSelector.getName(organization);
  const appointmentTime = appointmentSelector.getStartDateTime(appointment);
  const questionnaireResponse = questionnaireResponseSelector.getQuestionnaireResponse(
    questionnaire[0].questionnaireResponse,
  );
  const questionnaireResponseStatus = questionnaireResponse?.status;
  return (
    <QuestionnaireItem
      data={data}
      extraText={
        isCancelled
          ? 'You can access this questionnaire to copy answers for a rescheduled appointment.'
          : ''
      }
      Actions={() =>
        isCancelled ? (
          <PrintButton
            facilityName={facilityName}
            appointmentTime={appointmentTime}
            questionnaireResponseId={questionnaireResponse?.id}
          />
        ) : (
          <AnswerQuestions
            fullData={data}
            id={appointment.id}
            facilityName={facilityName}
            appointmentTime={appointmentTime}
            status={questionnaireResponseStatus}
            useActionLink
          />
        )
      }
      DueDate={() => {
        if (!appointmentTime)
          return (
            <section className="due-date" data-testid="due-date">
              <p />
            </section>
          );
        const displayTime = appointmentSelector.getStartTimeInTimeZone(
          appointment,
        );

        const timeTagTime = appointmentSelector.getStartTimeInTimeZone(
          appointment,
          {
            timeZone: 'America/Los_Angeles',
            momentFormat: `YYYY-MM-DDTh:mm`,
          },
        );
        const dueDate = moment(appointmentTime);
        return (
          <>
            <dt
              className="vads-u-margin-top--1p5"
              data-testid="due-instructions"
            >
              {isCancelled ? 'Access until' : 'Complete by'}
            </dt>

            <dd data-testid="due-date" className="due-date">
              {dueDate.format('dddd')}{' '}
              <time dateTime={timeTagTime}>
                {dueDate.format('MMMM D, YYYY')}
                {!isCancelled && (
                  <span data-testid="due-by-timestamp"> at {displayTime}</span>
                )}
              </time>
            </dd>
          </>
        );
      }}
    />
  );
}
