import { differenceInCalendarDays, parseISO } from 'date-fns';
import { getDemographicsStatuses } from '../demographics';

const updateFormPages = (
  patientDemographicsStatus,
  pages,
  URLS,
  isTravelReimbursementEnabled = false,
  appointments = [],
  isTravelLogicEnabled = false,
  travelPaySent = {},
) => {
  const skippedPages = [];

  const {
    demographicsUpToDate,
    nextOfKinUpToDate,
    emergencyContactUpToDate,
  } = getDemographicsStatuses(patientDemographicsStatus);

  if (demographicsUpToDate) {
    skippedPages.push(URLS.DEMOGRAPHICS);
  }
  if (nextOfKinUpToDate) {
    skippedPages.push(URLS.NEXT_OF_KIN);
  }
  if (emergencyContactUpToDate) {
    skippedPages.push(URLS.EMERGENCY_CONTACT);
  }

  const travelPayPages = [
    URLS.TRAVEL_QUESTION,
    URLS.TRAVEL_VEHICLE,
    URLS.TRAVEL_ADDRESS,
    URLS.TRAVEL_MILEAGE,
    URLS.TRAVEL_REVIEW,
  ];

  // Skip travel pay if not enabled, if veteran has more than one appointment for the day, or station if not in the allow list.
  // The allowlist currently only looks at the first appointment in the array, if we support multiple appointments later, this will need to get updated to a loop.
  let skipLogic = appointments.length > 1;

  if (isTravelLogicEnabled) {
    const { stationNo } = appointments[0];
    skipLogic =
      stationNo in travelPaySent &&
      !differenceInCalendarDays(Date.now(), parseISO(travelPaySent[stationNo]));
  }
  if (!isTravelReimbursementEnabled || skipLogic) {
    skippedPages.push(...travelPayPages);
  }
  return pages.filter(page => !skippedPages.includes(page));
};

const URLS = Object.freeze({
  CONFIRMATION: 'complete',
  DEMOGRAPHICS: 'contact-information',
  EMERGENCY_CONTACT: 'emergency-contact',
  ERROR: 'error',
  INTRODUCTION: 'introduction',
  LANDING: '',
  APPOINTMENTS: 'appointments',
  NEXT_OF_KIN: 'next-of-kin',
  SEE_STAFF: 'see-staff',
  VERIFY: 'verify',
  COMPLETE: 'complete',
  DETAILS: 'details',
  VALIDATION_NEEDED: 'verify',
  TRAVEL_QUESTION: 'travel-pay',
  TRAVEL_VEHICLE: 'travel-vehicle',
  TRAVEL_ADDRESS: 'travel-address',
  TRAVEL_MILEAGE: 'travel-mileage',
  TRAVEL_REVIEW: 'travel-review',
  APPOINTMENT_DETAILS: 'appointment-details',
});

export { updateFormPages, URLS };
