const PURPOSE_TEXT = Object.freeze([
  {
    label: 'Follow-up/Routine',
  },
  {
    label: 'New issue',
  },
  {
    label: 'Medication concern',
  },
  {
    label: 'My reason isn’t listed',
  },
]);

const getBookingNoteFromAppointment = appointment => {
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
      bookingNote.toLowerCase().startsWith(purpose.label.toLowerCase())
    ) {
      const splatted = bookingNote.split(':');
      display.found = true;
      display.reasonForVisit = splatted[0]?.trim();
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
