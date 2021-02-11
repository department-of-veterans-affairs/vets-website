import React from 'react';
import moment from 'moment-timezone';

import AnswerQuestions from '../Shared/Buttons/AnswerQuestions';
import PrintButton from '../Shared/Print/PrintButton';
import { getAppointmentStatus, isAppointmentCancelled } from '../../../utils';

import QuestionnaireItem from '../QuestionnaireItem';

export default function ToDoQuestionnaireItem({ data }) {
  const { appointment, questionnaire } = data;
  const appointmentStatus = getAppointmentStatus(appointment);
  const isCancelled = isAppointmentCancelled(appointmentStatus);

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
          <PrintButton />
        ) : (
          <AnswerQuestions
            id={appointment.id}
            facilityName={
              appointment.attributes.vdsAppointments[0].clinic.facility
                .displayName
            }
            appointmentTime={
              appointment.attributes.vdsAppointments[0].appointmentTime
            }
            status={questionnaire[0].questionnaireResponse.status}
          />
        )
      }
      DueDate={() => {
        const dueDate = moment(
          appointment.attributes.vdsAppointments[0].appointmentTime,
        );
        const guess = moment.tz.guess();
        const formattedTimezone = moment.tz(guess).format('z');
        const meridiem = dueDate.hours() > 12 ? 'p.m.' : 'a.m.';
        return (
          <section className="due-date" data-testid="due-date">
            <p>{isCancelled ? 'Access until' : 'Complete by'}</p>
            <p className="vads-u-font-weight--bold">
              {dueDate.format('dddd, MMMM D, YYYY')}
            </p>
            {!isCancelled && (
              <p
                className="vads-u-font-weight--bold"
                data-testid="due-by-timestamp"
              >
                {dueDate.format(`H:MM`)} {meridiem} {formattedTimezone}
              </p>
            )}
          </section>
        );
      }}
    />
  );
}
