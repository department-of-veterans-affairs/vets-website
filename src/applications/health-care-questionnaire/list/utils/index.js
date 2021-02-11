const getAppointmentStatus = appointment => {
  if (appointment?.attributes?.vdsAppointments) {
    return appointment?.attributes?.vdsAppointments[0]?.currentStatus;
  }
  return null;
};

const isAppointmentCancelled = appointmentStatus =>
  appointmentStatus?.toUpperCase().includes('CANCELLED');

const sortQuestionnairesByStatus = questionnaires => {
  let data = questionnaires;
  if (!data) {
    data = [];
  }

  data = data.filter(
    f =>
      !(
        !f.questionnaire[0]?.questionnaireResponse.status &&
        f.appointment.attributes.vdsAppointments[0].currentStatus.includes(
          'CANCELLED',
        )
      ),
  );

  data.sort((first, second) => {
    const f = first.appointment.attributes.vdsAppointments[0].appointmentTime;
    const s = second.appointment.attributes.vdsAppointments[0].appointmentTime;
    return new Date(f) - new Date(s);
  });
  const completed = data.filter(
    f => f.questionnaire[0]?.questionnaireResponse.status === 'completed',
  );
  const toDo = data.filter(f => {
    const questionnaireStatus =
      f.questionnaire[0]?.questionnaireResponse.status;
    const appointmentStatus = getAppointmentStatus(f.appointment);
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

export {
  sortQuestionnairesByStatus,
  getAppointmentStatus,
  isAppointmentCancelled,
};
