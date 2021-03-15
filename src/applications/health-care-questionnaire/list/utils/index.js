import { appointment } from '../../shared/utils/selectors';

const isAppointmentCancelled = appointmentStatus =>
  appointmentStatus?.toLowerCase().includes('cancelled');

const sortQuestionnairesByStatus = questionnaires => {
  let data = questionnaires;
  if (!data) {
    data = [];
  }
  // NEED TEST CASE FOR: remove items where the appointment is cancelled, and there is not questionnaire status
  data = data.filter(
    f =>
      !(
        !f.questionnaire[0]?.questionnaireResponse[0].status &&
        isAppointmentCancelled(appointment.getStatus(f.appointment))
      ),
  );

  // sort the items based on appointment time
  data.sort((first, second) => {
    const f = first.appointment.attributes.vdsAppointments[0].appointmentTime;
    const s = second.appointment.attributes.vdsAppointments[0].appointmentTime;
    return new Date(f) - new Date(s);
  });

  // find appointments that are completed based on questionnaire status
  const completed = data.filter(
    f => f.questionnaire[0]?.questionnaireResponse.status === 'completed',
  );

  // find appointments that have questionnaires
  const toDo = data.filter(f => {
    const questionnaireStatus =
      f.questionnaire[0]?.questionnaireResponse.status;
    const appointmentStatus = appointment.getStatus(f.appointment);
    return (
      (appointmentStatus === 'FUTURE' && !questionnaireStatus) ||
      (appointmentStatus === 'FUTURE' &&
        questionnaireStatus === 'in-progress') ||
      (isAppointmentCancelled(appointmentStatus) &&
        questionnaireStatus === 'in-progress')
    );
  });

  return {
    completed,
    toDo,
  };
};

export { sortQuestionnairesByStatus, isAppointmentCancelled };
