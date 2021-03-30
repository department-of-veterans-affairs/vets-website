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
  const appointmentTime = appointmentSelector.getStartTime(appointment);
  const questionnaireResponseStatus = questionnaireResponseSelector.getStatus(
    questionnaire[0].questionnaireResponse,
  );
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
          />
        ) : (
          <AnswerQuestions
            fullData={data}
            id={appointment.id}
            facilityName={facilityName}
            appointmentTime={appointmentTime}
            status={questionnaireResponseStatus}
          />
        )
      }
      DueDate={() => {
        const dueDate = moment(appointmentTime);
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
                {dueDate.format(`h:mm`)} {meridiem} {formattedTimezone}
              </p>
            )}
          </section>
        );
      }}
    />
  );
}
