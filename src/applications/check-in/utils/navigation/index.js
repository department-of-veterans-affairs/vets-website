import { differenceInCalendarDays } from 'date-fns';

const isWithInDays = (days, pageLastUpdated) => {
  const daysAgo = differenceInCalendarDays(Date.now(), pageLastUpdated);
  return daysAgo <= days;
};

const updateFormPages = (
  patientDemographicsStatus,
  checkInExperienceUpdateInformationPageEnabled,
  pages,
  URLS,
) => {
  let newPages = pages;
  if (!checkInExperienceUpdateInformationPageEnabled) {
    newPages = pages.filter(page => page !== URLS.UPDATE_INSURANCE);
  }
  const skippedPages = [];
  const {
    demographicsNeedsUpdate,
    demographicsConfirmedAt,
    nextOfKinNeedsUpdate,
    nextOfKinConfirmedAt,
    emergencyContactNeedsUpdate,
    emergencyContactConfirmedAt,
  } = patientDemographicsStatus;

  const skipablePages = [
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

  skipablePages.forEach(page => {
    const pageLastUpdated = page.confirmedAt
      ? new Date(page.confirmedAt)
      : null;
    if (
      pageLastUpdated &&
      isWithInDays(3, pageLastUpdated) &&
      page.needsUpdate === false
    ) {
      skippedPages.push(page.url);
    }
  });
  newPages = newPages.filter(page => !skippedPages.includes(page));
  return newPages;
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
  UPDATE_INSURANCE: 'update-information',
  VALIDATION_NEEDED: 'verify',
  LOADING: 'loading-appointments',
  EDIT_ADDRESS: 'edit-address',
  EDIT_PHONE_NUMBER: 'edit-phone-number',
  EDIT_EMAIL: 'edit-email',
  EDIT_RELATIONSHIP: 'edit-relationship',
  EDIT_NAME: 'edit-name',
});

export { updateFormPages, URLS };
