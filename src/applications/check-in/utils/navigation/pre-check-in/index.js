/**
 * @param {Object} location
 * @param {Object} [location.query]
 * @param {string} [location.query.id]
 */
const getTokenFromLocation = location => location?.query?.id;

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
});

const PRE_CHECK_IN_FORM_PAGES = Object.freeze([
  {
    url: URLS.VERIFY,
    order: 0,
  },
  {
    url: URLS.INTRODUCTION,
    order: 1,
  },
  {
    url: URLS.DEMOGRAPHICS,
    order: 2,
  },
  {
    url: URLS.NEXT_OF_KIN,
    order: 3,
  },
  {
    url: URLS.EMERGENCY_CONTACT,
    order: 4,
  },
  {
    url: URLS.CONFIRMATION,
    order: 5,
  },
]);

const createForm = ({ isEmergencyContactEnabled = false }) => {
  let pages = PRE_CHECK_IN_FORM_PAGES.map(page => page.url);
  if (!isEmergencyContactEnabled) {
    pages = pages.filter(page => page !== URLS.EMERGENCY_CONTACT);
  }
  return pages;
};

const updateForm = patientDemographicsStatus => {
  let pages = PRE_CHECK_IN_FORM_PAGES.map(page => page.url);
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
      url: URLS.EMERGENCY_CONTACT,
      confirmedAt: nextOfKinConfirmedAt,
      needsUpdate: nextOfKinNeedsUpdate,
    },
    {
      url: URLS.NEXT_OF_KIN,
      confirmedAt: emergencyContactConfirmedAt,
      needsUpdate: emergencyContactNeedsUpdate,
    },
  ];
  const timeTillExpire = 24;

  const now = Date.now();

  skipablePages.forEach(page => {
    const pageLastUpdated = page.confirmedAt
      ? new Date(page.confirmedAt)
      : null;
    if (
      pageLastUpdated &&
      Math.abs(now - pageLastUpdated) / 36e5 <= timeTillExpire &&
      page.needsUpdate === false
    ) {
      skippedPages.push(URLS.DEMOGRAPHICS);
    }
  });

  pages = pages.filter(page => !skippedPages.includes(page));
  return pages;
};

export {
  URLS,
  PRE_CHECK_IN_FORM_PAGES,
  createForm,
  getTokenFromLocation,
  updateForm,
};
