// Mock responses for GET /v0/veteran_status_card endpoint

// Eligible response - shows the veteran status card
const eligible = {
  type: 'veteran_status_card',
  veteranStatus: 'confirmed',
  serviceSummaryCode: 'A1',
  notConfirmedReason: null,
  attributes: {
    fullName: 'Jane Veteran',
    disabilityRating: 50,
    latestService: {
      branch: 'Army',
      beginDate: '2010-01-01',
      endDate: '2020-12-31',
    },
    edipi: 1234567890,
  },
};

// Warning alert - dishonorable discharge
const dishonorableDischarge = {
  type: 'veteran_status_alert',
  veteranStatus: 'not confirmed',
  serviceSummaryCode: 'A5',
  notConfirmedReason: 'DISHONORABLE_DISCHARGE',
  attributes: {
    header: "You're not eligible for a Veteran Status Card",
    body: [
      {
        type: 'text',
        value:
          "Our records show you don't meet the service or discharge requirements for a Veteran Status Card.",
      },
      {
        type: 'text',
        value:
          'If you think this information is wrong, you can request to correct your military records.',
      },
      {
        type: 'link',
        value: 'Learn how to correct your military records',
        url:
          'https://www.archives.gov/veterans/military-service-records/correct-service-records.html',
      },
    ],
    alertType: 'warning',
  },
};

// Warning alert - person not found
const personNotFound = {
  type: 'veteran_status_alert',
  veteranStatus: 'not confirmed',
  serviceSummaryCode: 'D',
  notConfirmedReason: 'PERSON_NOT_FOUND',
  attributes: {
    header: "You're not eligible for a Veteran Status Card",
    body: [
      { type: 'text', value: "Our records don't show you're a Veteran." },
      {
        type: 'text',
        value: 'If you have questions, call the VA.gov help desk.',
      },
      { type: 'phone', value: '800-698-2411', tty: true },
    ],
    alertType: 'warning',
  },
};

// Error alert - system error
const systemError = {
  type: 'veteran_status_alert',
  veteranStatus: 'not confirmed',
  serviceSummaryCode: 'VNA',
  notConfirmedReason: 'ERROR',
  attributes: {
    header: 'Something went wrong',
    body: [
      {
        type: 'text',
        value:
          "We're sorry. We can't access your Veteran status information right now. Please try again later.",
      },
    ],
    alertType: 'error',
  },
};

module.exports = {
  eligible,
  dishonorableDischarge,
  personNotFound,
  systemError,
};
