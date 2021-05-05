import cancelledAppointmentCompletedQuestionnaire from './cancelled.appointment.completed.primary.care.questionnaire.json';
import cancelledAppointmentInProgressQuestionnaire from './cancelled.appointment.in.progress.primary.care.questionnaire.json';
import cancelledAppointmentNotStartedQuestionnaire from './cancelled.appointment.not.started.primary.care.questionnaire.json';
import upcomingPrimaryCareAppointmentCompletedQuestionnaire from './upcoming.appointment.completed.primary.care.questionnaire.json';
import upcomingPrimaryCareAppointmentInProgressQuestionnaire from './upcoming.appointment.in.progress.primary.care.questionnaire.json';
import upcomingMentalHealthAppointmentNotStartedQuestionnaire from './upcoming.appointment.not.started.mental.health.questionnaire.json';
import upcomingPrimaryCareAppointmentNotStartedQuestionnaire from './upcoming.appointment.not.started.primary.care.questionnaire.json';

const json = {
  data: [
    upcomingPrimaryCareAppointmentCompletedQuestionnaire,
    upcomingPrimaryCareAppointmentInProgressQuestionnaire,
    upcomingMentalHealthAppointmentNotStartedQuestionnaire,
    upcomingPrimaryCareAppointmentNotStartedQuestionnaire,
    cancelledAppointmentCompletedQuestionnaire,
    cancelledAppointmentInProgressQuestionnaire,
    cancelledAppointmentNotStartedQuestionnaire,
  ],
};

export { json };
