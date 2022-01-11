/**
 * @param {Object} location
 * @param {Object} [location.query]
 * @param {string} [location.query.id]
 */
const getTokenFromLocation = location => location?.query?.id;

/**
 * @param {Object} router
 * @param {string} target
 * @param {Object} [params]
 * @param {Object} [params.url]
 */

const URLS = Object.freeze({
  COMPLETE: 'complete',
  EMERGENCY_CONTACT: 'emergency-contact',
  DEMOGRAPHICS: 'contact-information',
  DETAILS: 'details',
  ERROR: 'error',
  LANDING: '',
  NEXT_OF_KIN: 'next-of-kin',
  SEE_STAFF: 'see-staff',
  UPDATE_INSURANCE: 'update-information',
  VALIDATION_NEEDED: 'verify',
});

const CHECK_IN_FORM_PAGES = Object.freeze([
  {
    url: URLS.VALIDATION_NEEDED,
    order: 0,
  },
  {
    url: URLS.DEMOGRAPHICS,
    order: 1,
  },
  {
    url: URLS.EMERGENCY_CONTACT,
    order: 2,
  },
  {
    url: URLS.NEXT_OF_KIN,
    order: 3,
  },
  {
    url: URLS.UPDATE_INSURANCE,
    order: 4,
  },
  {
    url: URLS.DETAILS,
    order: 5,
  },
  {
    url: URLS.COMPLETE,
    order: 6,
  },
]);

const createForm = ({
  hasConfirmedDemographics = false,
  isEmergencyContactEnabled = false,
  isUpdatePageEnabled = false,
}) => {
  let pages = [...CHECK_IN_FORM_PAGES]
    .sort((a, b) => a.order - b.order)
    .map(page => page.url);
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
  if (!isUpdatePageEnabled) {
    pages = pages.filter(page => page !== URLS.UPDATE_INSURANCE);
  }
  return pages;
};

export { URLS, CHECK_IN_FORM_PAGES, createForm, getTokenFromLocation };
