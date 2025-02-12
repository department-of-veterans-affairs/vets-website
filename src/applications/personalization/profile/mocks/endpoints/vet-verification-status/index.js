const confirmed = {
  data: {
    id: '',
    type: 'veteran_status_confirmations',
    attributes: {
      veteranStatus: 'confirmed',
    },
  },
};

const notConfirmedProblem = {
  data: {
    id: null,
    type: 'veteran_status_confirmations',
    attributes: {
      veteranStatus: 'not confirmed',
      notConfirmedReason: 'PERSON_NOT_FOUND',
    },
    message: [
      'We’re sorry. There’s a problem with your discharge status records. We can’t provide a Veteran status card for you right now.',
      'To fix the problem with your records, call the Defense Manpower Data Center at 800-538-9552 (TTY: 711). They’re open Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.',
    ],
  },
};

const notConfirmedIneligible = {
  data: {
    id: '',
    type: 'veteran_status_confirmations',
    attributes: {
      veteranStatus: 'not confirmed',
      notConfirmedReason: 'NOT_TITLE_38',
    },
    message: [
      'Our records show that you’re not eligible for a Veteran status card. To get a Veteran status card, you must have received an honorable discharge for at least one period of service.',
      'If you think your discharge status is incorrect, call the Defense Manpower Data Center at 800-538-9552 (TTY: 711). They’re open Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.',
    ],
  },
};

const apiError = {
  errors: [
    {
      title: 'Gateway Timeout',
      detail: 'Did not receive a timely response from an upstream server.',
      code: '504',
      status: '504',
    },
  ],
};

module.exports = {
  confirmed,
  notConfirmedProblem,
  notConfirmedIneligible,
  apiError,
};
