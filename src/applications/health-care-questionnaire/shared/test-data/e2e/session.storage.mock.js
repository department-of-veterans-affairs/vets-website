import { AppointmentData } from '../appointment/factory';
import { QuestionnaireData } from '../questionnaire/factory';
import { LocationData } from '../location/factory';
import { OrganizationData } from '../organization/factory';

const setSessionStorage = (
  window,
  apptId,
  type = 'Primary Care',
  isInFuture = true,
) => {
  let appointment = new AppointmentData().withId(apptId);
  if (isInFuture) {
    appointment = appointment.inFuture();
  }
  const questionnaire = new QuestionnaireData();
  const location = new LocationData().withType(type);
  const organization = new OrganizationData();
  const data = JSON.stringify({
    appointment,
    questionnaire: [{ ...questionnaire }],
    location,
    organization,
  });

  window.sessionStorage.setItem(
    `health.care.questionnaire.selectedAppointmentData.${apptId}`,
    data,
  );
};

export { setSessionStorage };
