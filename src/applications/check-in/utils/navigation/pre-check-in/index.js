/**
 * @param {Object} location
 * @param {Object} [location.query]
 * @param {string} [location.query.id]
 */

import { differenceInHours } from 'date-fns';

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
    order: 4,
  },
  {
    url: URLS.EMERGENCY_CONTACT,
    order: 3,
  },
  {
    url: URLS.CONFIRMATION,
    order: 5,
  },
]);
const now = Date.now();

const isWithInHours = (hours, pageLastUpdated) => {
  const hoursAgo = differenceInHours(now, pageLastUpdated);

  return hoursAgo <= hours;
};

const getPagesInOrder = () =>
  [...PRE_CHECK_IN_FORM_PAGES].sort((a, b) => a.order - b.order);

const createForm = () => {
  return getPagesInOrder().map(page => page.url);
};

const updateForm = patientDemographicsStatus => {
  let pages = getPagesInOrder().map(page => page.url);
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
  pages = pages.filter(page => !skippedPages.includes(page));
  return pages;
};

export {
  URLS,
  PRE_CHECK_IN_FORM_PAGES,
  createForm,
  getPagesInOrder,
  getTokenFromLocation,
  updateForm,
};
