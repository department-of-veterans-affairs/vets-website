import {
  appointment,
  questionnaireResponse,
} from '../../shared/utils/selectors';

import { cancelled, booked } from '../../shared/constants/appointment.status';
import {
  completed as completedQuestionnaireResponseStatus,
  inProgress,
} from '../../shared/constants/questionnaire.response.status';

const isAppointmentCancelled = appointmentStatus =>
  appointmentStatus?.toLowerCase().includes(cancelled);

const sortQuestionnairesByStatus = questionnaires => {
  let data = questionnaires;
  if (!data) {
    data = [];
  }
  // NEED TEST CASE FOR: remove items where the appointment is cancelled, and there is not questionnaire status
  data = data.filter(f => {
    return !(
      !questionnaireResponse.getStatus(
        f.questionnaire[0]?.questionnaireResponse,
      ) && isAppointmentCancelled(appointment.getStatus(f.appointment))
    );
  });

  // sort the items based on appointment time
  data.sort((first, second) => {
    const f = appointment.getStartTime(first);
    const s = appointment.getStartTime(second);
    return new Date(f) - new Date(s);
  });

  // find appointments that are completed based on questionnaire status
  const completed = data.filter(f => {
    return (
      questionnaireResponse.getStatus(
        f.questionnaire[0]?.questionnaireResponse,
      ) === completedQuestionnaireResponseStatus
    );
  });

  // find appointments that have questionnaires
  const toDo = data.filter(f => {
    const questionnaireStatus = questionnaireResponse.getStatus(
      f.questionnaire[0]?.questionnaireResponse,
    );
    const appointmentStatus = appointment.getStatus(f.appointment);
    return (
      (appointmentStatus === booked && !questionnaireStatus) ||
      (appointmentStatus === booked && questionnaireStatus === inProgress) ||
      (isAppointmentCancelled(appointmentStatus) &&
        questionnaireStatus === inProgress)
    );
  });

  return {
    completed,
    toDo,
  };
};

export { sortQuestionnairesByStatus, isAppointmentCancelled };
