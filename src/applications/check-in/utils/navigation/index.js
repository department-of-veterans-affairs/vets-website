import { differenceInHours } from 'date-fns';

const now = Date.now();

const isWithInHours = (hours, pageLastUpdated) => {
  const hoursAgo = differenceInHours(now, pageLastUpdated);

  return hoursAgo <= hours;
};

const updateFormPages = (
  patientDemographicsStatus,
  isEmergencyContactEnabled,
  pages,
  URLS,
) => {
  let newPages = pages;
  if (!isEmergencyContactEnabled) {
    newPages = pages.filter(page => page !== URLS.EMERGENCY_CONTACT);
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
      isWithInHours(24, pageLastUpdated) &&
      page.needsUpdate === false
    ) {
      skippedPages.push(page.url);
    }
  });
  newPages = newPages.filter(page => !skippedPages.includes(page));
  return newPages;
};

export { updateFormPages };
