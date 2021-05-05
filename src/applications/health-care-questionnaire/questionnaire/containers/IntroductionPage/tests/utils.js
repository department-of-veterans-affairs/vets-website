import upcomingAppointment from './sample.upcoming.appointment.json';

const createFakeIntroductionPageStore = ({
  formId,
  savedForms,
  appointmentInThePast,
  isLoggedIn,
}) => {
  const today = new Date();
  const {
    questionnaire,
    location,
    organization,
    appointment,
  } = upcomingAppointment;
  appointment.start = new Date(today);
  if (appointmentInThePast) {
    appointment.start.setDate(appointment.start.getDate() - 1);
  } else {
    appointment.start.setDate(appointment.start.getDate() + 1);
  }
  return {
    getState: () => ({
      form: {
        pages: [],
        formId,
      },
      user: {
        profile: {
          savedForms: [...savedForms],
        },
        login: {
          currentlyLoggedIn: !!isLoggedIn,
        },
      },
      questionnaireData: {
        context: {
          questionnaire,
          location,
          organization,
          appointment,
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => ({
      toggleLoginModal: () => {},
    }),
  };
};

export { createFakeIntroductionPageStore };
