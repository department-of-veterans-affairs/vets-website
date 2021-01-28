const PURPOSE_TEXT = Object.freeze([
  {
    key: 'Follow-up/Routine',
    label: 'Routine or follow-up visit',
  },
  {
    key: 'New issue',
    label: 'I have a new medical issue',
  },
  {
    key: 'Medication concern',
    label: 'I have a concern or question about my medication',
  },
  {
    key: 'My reason isn’t listed',
    label: '',
  },
]);

// NOTE: There is a room for refactor here, but to make sure its the correct refactor,
// The front end team is waiting until a third method is created to create a smart refactor

const getBookingNoteFromAppointment = data => {
  const appointment = data?.attributes;
  if (!appointment) {
    return null;
  }
  if (!appointment.vdsAppointments?.length) {
    return null;
  }
  const bookingNote = appointment.vdsAppointments[0].bookingNotes;

  if (!bookingNote) {
    return null;
  }

  const display = {
    found: false,
    reasonForVisit: '',
    description: '',
  };

  PURPOSE_TEXT.forEach(purpose => {
    if (
      !display.found &&
      bookingNote.toLowerCase().startsWith(purpose.key.toLowerCase())
    ) {
      const splatted = bookingNote.split(':');
      display.found = true;
      display.reasonForVisit = purpose.label;
      display.description = splatted[1]?.trim();
    }
  });

  if (!display.found) {
    display.found = true;
    display.description = bookingNote;
  }

  return display;
};

const getAppointmentTypeFromClinic = (clinic, options = {}) => {
  if (!clinic) {
    return null;
  }
  const { titleCase } = options;
  const { stopCode } = clinic;
  if (!stopCode) {
    return null;
  }
  // Waiting till we expand our MVP to add more stop codes here
  let appointmentType = null;
  switch (stopCode.toString()) {
    case '323':
      appointmentType = 'primary care';
      break;
    case '502':
      appointmentType = 'mental health';
      break;
    default:
      return appointmentType;
  }

  return titleCase
    ? appointmentType.charAt(0).toUpperCase() +
        appointmentType.slice(1).toLowerCase()
    : appointmentType;
};

const getAppointmentTimeFromAppointment = data => {
  const appointment = data?.attributes;
  if (!appointment) {
    return null;
  }
  if (!appointment.vdsAppointments?.length) {
    return null;
  }
  const { appointmentTime } = appointment.vdsAppointments[0];
  return appointmentTime;
};

const getClinicFromAppointment = data => {
  const appointment = data?.attributes;
  if (!appointment) {
    return null;
  }
  if (!appointment.vdsAppointments?.length) {
    return null;
  }
  const { clinic } = appointment.vdsAppointments[0];
  if (clinic) {
    return {
      ...clinic,
      friendlyName: appointment.clinicFriendlyName,
    };
  }
  return clinic || null;
};

const getFacilityFromAppointment = data => {
  const clinic = getClinicFromAppointment(data);
  if (!clinic) {
    return null;
  }
  return clinic.facility;
};

const getAppointTypeFromAppointment = (data, options = {}) => {
  const clinic = getClinicFromAppointment(data);

  return getAppointmentTypeFromClinic(clinic, options);
};

export {
  getBookingNoteFromAppointment,
  getAppointTypeFromAppointment,
  getAppointmentTimeFromAppointment,
  getAppointmentTypeFromClinic,
  getFacilityFromAppointment,
  getClinicFromAppointment,
};
