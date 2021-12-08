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

const createForm = ({
  hasConfirmedDemographics = false,
  isEmergencyContactEnabled = false,
}) => {
  let pages = PRE_CHECK_IN_FORM_PAGES.map(page => page.url);
  if (hasConfirmedDemographics) {
    const skippedPages = [
      URLS.DEMOGRAPHICS,
      URLS.NEXT_OF_KIN,
      URLS.EMERGENCY_CONTACT,
    ];
    pages = pages.filter(page => !skippedPages.includes(page));
  }
  if (!isEmergencyContactEnabled) {
    pages = pages.filter(page => page !== URLS.EMERGENCY_CONTACT);
  }
  return pages;
};

export { URLS, PRE_CHECK_IN_FORM_PAGES, createForm, getTokenFromLocation };
