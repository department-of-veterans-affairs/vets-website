const URLS = Object.freeze({
  CONFIRMATION: 'complete',
  DEMOGRAPHICS: 'contact-information',
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
    order: 4,
  },
  {
    url: URLS.CONFIRMATION,
    order: 5,
  },
]);

const createForm = ({ hasConfirmedDemographics = false }) => {
  let pages = PRE_CHECK_IN_FORM_PAGES.map(page => page.url);
  if (hasConfirmedDemographics) {
    pages = pages.filter(
      page => page !== URLS.DEMOGRAPHICS && page !== URLS.NEXT_OF_KIN,
    );
  }
  return pages;
};

export { URLS, PRE_CHECK_IN_FORM_PAGES, createForm };
