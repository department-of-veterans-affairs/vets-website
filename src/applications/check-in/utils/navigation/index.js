import { differenceInCalendarDays, parseISO } from 'date-fns';
import { getDemographicsStatuses } from '../demographics';

const updateFormPages = (
  patientDemographicsStatus,
  pages,
  URLS,
  isTravelReimbursementEnabled = false,
  travelPaySent = '',
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

  const skipLogic =
    travelPaySent &&
    !differenceInCalendarDays(Date.now(), parseISO(travelPaySent));
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
  LOADING: 'loading',
  APPOINTMENTS: 'appointments',
  UPCOMING_APPOINTMENTS: 'upcoming-appointments',
  NEXT_OF_KIN: 'next-of-kin',
  SEE_STAFF: 'see-staff',
  VERIFY: 'verify',
  COMPLETE: 'complete',
  VALIDATION_NEEDED: 'verify',
  TRAVEL_AGREEMENT: 'travel-agreement',
  TRAVEL_INTRO: 'travel-pay',
  TRAVEL_QUESTION: 'travel-pay',
  TRAVEL_VEHICLE: 'travel-vehicle',
  TRAVEL_ADDRESS: 'travel-address',
  TRAVEL_MILEAGE: 'travel-mileage',
  TRAVEL_REVIEW: 'travel-review',
  APPOINTMENT_DETAILS: 'appointment-details',
  ARRIVED: 'arrived',
  RESOURCES: 'what-to-bring',
});

export { updateFormPages, URLS };
