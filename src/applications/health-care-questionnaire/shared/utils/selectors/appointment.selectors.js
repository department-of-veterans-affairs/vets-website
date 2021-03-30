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

const getBookingNote = appointment => {
  if (!appointment) {
    return null;
  }
  const { comment } = appointment;
  if (!comment) {
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
      comment.toLowerCase().startsWith(purpose.key.toLowerCase())
    ) {
      const splatted = comment.split(':');
      display.found = true;
      display.reasonForVisit = purpose.label;
      display.description = splatted[1]?.trim();
    }
  });

  if (!display.found) {
    display.found = true;
    display.description = comment;
  }

  return display;
};

const getStatus = appointment => {
  return appointment ? appointment.status : null;
};

const getStartTime = appointment => {
  return appointment ? appointment.start : null;
};

export { getStatus, getStartTime, getBookingNote };
