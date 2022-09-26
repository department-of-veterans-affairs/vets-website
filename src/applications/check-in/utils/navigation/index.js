import { differenceInCalendarDays } from 'date-fns';

const isWithInDays = (days, pageLastUpdated) => {
  const daysAgo = differenceInCalendarDays(Date.now(), pageLastUpdated);
  return daysAgo <= days;
};

const updateFormPages = (
  patientDemographicsStatus,
  pages,
  URLS,
  isTravelPay = true,
) => {
  const skippedPages = [];
  const {
    demographicsNeedsUpdate,
    demographicsConfirmedAt,
    nextOfKinNeedsUpdate,
    nextOfKinConfirmedAt,
    emergencyContactNeedsUpdate,
    emergencyContactConfirmedAt,
  } = patientDemographicsStatus;

  const skippablePages = [
    {
      url: URLS.DEMOGRAPHICS,
      confirmedAt: demographicsConfirmedAt,
      needsUpdate: demographicsNeedsUpdate,
    },
    {
      url: URLS.NEXT_OF_KIN,
      confirmedAt: nextOfKinConfirmedAt,
      needsUpdate: nextOfKinNeedsUpdate,
    },
    {
      url: URLS.EMERGENCY_CONTACT,
      confirmedAt: emergencyContactConfirmedAt,
      needsUpdate: emergencyContactNeedsUpdate,
    },
  ];
  const travelPayPages = [
    URLS.TRAVEL_QUESTION,
    URLS.TRAVEL_VEHICLE,
    URLS.TRAVEL_ADDRESS,
    URLS.TRAVEL_MILAGE,
  ];
  skippablePages.forEach(page => {
    const pageLastUpdated = page.confirmedAt
      ? new Date(page.confirmedAt)
      : null;
    if (
      pageLastUpdated &&
      isWithInDays(7, pageLastUpdated) &&
      page.needsUpdate === false
    ) {
      skippedPages.push(page.url);
    }
  });
  if (!isTravelPay) {
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
  NEXT_OF_KIN: 'next-of-kin',
  SEE_STAFF: 'see-staff',
  VERIFY: 'verify',
  COMPLETE: 'complete',
  DETAILS: 'details',
  VALIDATION_NEEDED: 'verify',
  LOADING: 'loading-appointments',
  TRAVEL_QUESTION: 'travel-pay',
  TRAVEL_VEHICLE: 'travel-vehicle',
  TRAVEL_ADDRESS: 'travel-address',
  TRAVEL_MILAGE: 'travel-milage',
});

export { updateFormPages, URLS };
