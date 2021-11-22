import {
  appointmentSelector,
  questionnaireResponseSelector,
} from '../../shared/utils/selectors';

import {
  cancelled,
  booked,
  arrived,
} from '../../shared/constants/appointment.status';
import {
  completed as completedQuestionnaireResponseStatus,
  inProgress,
  enteredInError,
} from '../../shared/constants/questionnaire.response.status';

import isBefore from 'date-fns/isBefore';

const isAppointmentCancelled = appointmentStatus =>
  appointmentStatus?.toLowerCase().includes(cancelled);

const sortQuestionnairesByStatus = questionnaires => {
  let data = questionnaires;
  if (!data) {
    data = [];
  }

  // TEST CASE: remove items where the appointment is cancelled, and there is not questionnaire status
  data = data.filter(f => {
    return !(
      !questionnaireResponseSelector.getStatus(
        f.questionnaire[0]?.questionnaireResponse,
      ) && isAppointmentCancelled(appointmentSelector.getStatus(f.appointment))
    );
  });

  // sort the items based on appointment time
  data.sort((first, second) => {
    const f = appointmentSelector.getStartDateTime(first.appointment);
    const s = appointmentSelector.getStartDateTime(second.appointment);
    return new Date(f) - new Date(s);
  });

  // find appointments that are completed based on questionnaire status
  const completed = data.filter(f => {
    return (
      questionnaireResponseSelector.getStatus(
        f.questionnaire[0]?.questionnaireResponse,
      ) === completedQuestionnaireResponseStatus
    );
  });

  // // find appointments that have questionnaires
  const toDo = data
    // an appointment with the statuses we are looking for
    .filter(f => {
      const appointmentStatus = appointmentSelector.getStatus(f.appointment);
      return (
        appointmentStatus === booked ||
        appointmentStatus === arrived ||
        isAppointmentCancelled(appointmentStatus)
      );
    })
    // return the ones with the correct status
    .filter(f => {
      const questionnaireStatus = questionnaireResponseSelector.getStatus(
        f.questionnaire[0]?.questionnaireResponse,
      );
      return (
        !questionnaireStatus ||
        questionnaireStatus === enteredInError ||
        questionnaireStatus === inProgress
      );
    })
    // check for appointments in the past that not completed
    .filter(f => {
      const apptTime = appointmentSelector.getStartDateTime(f.appointment);
      if (apptTime) {
        // get yesterday's date,
        const appt = new Date(apptTime);

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        return isBefore(yesterday, appt);
      } else {
        return false;
      }
    });

  return {
    completed,
    toDo,
  };
};

export { sortQuestionnairesByStatus, isAppointmentCancelled };
