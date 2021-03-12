const createFakeIntroductionPageStore = ({
  formId,
  savedForms,
  appointmentInThePast,
}) => {
  const today = new Date();
  const appointmentTime = new Date(today);
  if (appointmentInThePast) {
    appointmentTime.setDate(appointmentTime.getDate() - 1);
  } else {
    appointmentTime.setDate(appointmentTime.getDate() + 1);
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
      },
      questionnaireData: {
        context: {
          appointment: {
            attributes: {
              vdsAppointments: [
                {
                  appointmentTime,
                  clinic: { facility: { displayName: 'Magic Kingdom' } },
                },
              ],
            },
          },
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
