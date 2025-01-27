const confirmed = {
  data: {
    id: '',
    type: 'veteran_status_confirmations',
    attributes: {
      veteranStatus: 'confirmed',
    },
  },
};

const notConfirmed = {
  data: {
    id: null,
    type: 'veteran_status_confirmations',
    attributes: {
      veteranStatus: 'not confirmed',
      notConfirmedReason: 'PERSON_NOT_FOUND',
      message: [
        'We’re sorry. There’s a problem with your discharge status records. We can’t provide a Veteran status card for you right now.',
        'To fix the problem with your records, call the Defense Manpower Data Center at 800-538-9552 (TTY: 711). They’re open Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.',
      ],
    },
  },
};

module.exports = {
  confirmed,
  notConfirmed,
};
