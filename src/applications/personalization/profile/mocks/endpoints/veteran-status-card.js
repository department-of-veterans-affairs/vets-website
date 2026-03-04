// Mock responses for GET /v0/veteran_status_card endpoint

// Eligible response - shows the veteran status card
const eligible = {
  type: 'veteran_status_card',
  attributes: {
    fullName: 'Jane Veteran',
    disabilityRating: 50,
    edipi: 1234567890,
    veteranStatus: 'confirmed',
    notConfirmedReason: null,
    confirmationStatus: 'CONFIRMED',
    serviceSummaryCode: 'A1',
  },
};

// Warning alert - dishonorable discharge
const dishonorableDischarge = {
  type: 'veteran_status_alert',
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
    veteranStatus: 'not confirmed',
    notConfirmedReason: 'DISHONORABLE_DISCHARGE',
    confirmationStatus: 'NOT_CONFIRMED',
    serviceSummaryCode: 'A5',
  },
};

// Warning alert - person not found
const personNotFound = {
  type: 'veteran_status_alert',
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
    veteranStatus: 'not confirmed',
    notConfirmedReason: 'PERSON_NOT_FOUND',
    confirmationStatus: 'NOT_CONFIRMED',
    serviceSummaryCode: 'D',
  },
};

// Error alert - system error
const systemError = {
  type: 'veteran_status_alert',
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
    veteranStatus: 'not confirmed',
    notConfirmedReason: 'ERROR',
    confirmationStatus: 'NOT_CONFIRMED',
    serviceSummaryCode: 'VNA',
  },
};

// Warning alert - ineligible service (service history doesn't meet requirements)
const ineligibleService = {
  type: 'veteran_status_alert',
  attributes: {
    header: "You're not eligible for a Veteran Status Card",
    body: [
      {
        type: 'text',
        value:
          "Your service history doesn't meet the requirements for a Veteran Status Card.",
      },
      {
        type: 'text',
        value:
          "If you think this is incorrect, call us. We're here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.",
      },
      { type: 'phone', value: '866-279-3677', tty: true },
    ],
    alertType: 'warning',
    veteranStatus: 'not confirmed',
    notConfirmedReason: 'INELIGIBLE_SERVICE',
    confirmationStatus: 'NOT_CONFIRMED',
    serviceSummaryCode: 'B',
  },
};

// Warning alert - currently serving
const currentlyServing = {
  type: 'veteran_status_alert',
  attributes: {
    header: "You're not eligible for a Veteran Status Card",
    body: [
      {
        type: 'text',
        value:
          "You can't get a Veteran Status Card if you're currently serving.",
      },
      {
        type: 'text',
        value:
          "If you have a previous period of service, call us. We're here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.",
      },
      { type: 'phone', value: '866-279-3677', tty: true },
    ],
    alertType: 'warning',
    veteranStatus: 'not confirmed',
    notConfirmedReason: 'CURRENTLY_SERVING',
    confirmationStatus: 'NOT_CONFIRMED',
    serviceSummaryCode: 'C',
  },
};

// Warning alert - eligibility unknown
const eligibilityUnknown = {
  type: 'veteran_status_alert',
  attributes: {
    header: "We don't know if you're eligible for this card",
    body: [
      {
        type: 'text',
        value:
          'Your record is missing information about your service history or discharge status.',
      },
      {
        type: 'text',
        value:
          "To fix the problem, call us. We're here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.",
      },
      { type: 'phone', value: '866-279-3677', tty: true },
    ],
    alertType: 'warning',
    veteranStatus: 'not confirmed',
    notConfirmedReason: 'ELIGIBILITY_UNKNOWN',
    confirmationStatus: 'NOT_CONFIRMED',
    serviceSummaryCode: 'E',
  },
};

module.exports = {
  eligible,
  dishonorableDischarge,
  personNotFound,
  systemError,
  ineligibleService,
  currentlyServing,
  eligibilityUnknown,
};
