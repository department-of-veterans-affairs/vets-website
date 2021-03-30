import {
  appointmentSelector,
  questionnaireResponseSelector,
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
      !questionnaireResponseSelector.getStatus(
        f.questionnaire[0]?.questionnaireResponse,
      ) && isAppointmentCancelled(appointmentSelector.getStatus(f.appointment))
    );
  });

  // sort the items based on appointment time
  data.sort((first, second) => {
    const f = appointmentSelector.getStartTime(first.appointment);
    const s = appointmentSelector.getStartTime(second.appointment);
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

  // find appointments that have questionnaires
  const toDo = data.filter(f => {
    const questionnaireStatus = questionnaireResponseSelector.getStatus(
      f.questionnaire[0]?.questionnaireResponse,
    );
    const appointmentStatus = appointmentSelector.getStatus(f.appointment);
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
