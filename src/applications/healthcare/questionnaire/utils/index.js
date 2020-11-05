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

export { getBookingNoteFromAppointment };
