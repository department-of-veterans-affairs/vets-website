import { startReferralTimer } from './utils/timer';

/**
 * Function to get referral page flow.
 *
 * @export
 * @param {string} referralId - The referral unique identifier
 * @returns {object} Referral appointment workflow object
 */
export default function getPageFlow(referralId) {
  return {
    appointments: {
      url: '/',
      label: 'Appointments',
      next: 'scheduleReferral',
      previous: '',
      breadcrumbText: 'Appointments',
      useBackBreadcrumb: false,
    },
    referralsAndRequests: {
      url: '/referrals-requests',
      label: 'Active referrals',
      next: 'scheduleReferral',
      previous: 'appointments',
      breadcrumbText: 'Requests and referrals',
      useBackBreadcrumb: false,
    },
    scheduleReferral: {
      url: `/schedule-referral?id=${referralId}`,
      label: 'Referral for',
      next: 'scheduleAppointment',
      previous: 'referralsAndRequests',
      breadcrumbText: 'Referral for {{ categoryOfCare }}',
      useBackBreadcrumb: false,
    },
    scheduleAppointment: {
      url: `/schedule-referral/date-time?id=${referralId}`,
      label: 'Schedule an appointment with your provider',
      next: 'reviewAndConfirm',
      previous: 'scheduleReferral',
      breadcrumbText: 'Back',
      useBackBreadcrumb: true,
    },
    reviewAndConfirm: {
      url: `/schedule-referral/review?id=${referralId}`,
      label: 'Review your appointment details',
      next: 'complete',
      previous: 'scheduleAppointment',
      breadcrumbText: 'Back',
      useBackBreadcrumb: true,
    },
    complete: {
      url: `/schedule-referral/complete?id=${referralId}&confirmMsg=true`,
      label: 'Your appointment is scheduled',
      next: '',
      previous: 'reviewAndConfirm',
      breadcrumbText: 'Back to appointments',
      useBackBreadcrumb: true,
    },
  };
}

export function routeToPageInFlow(history, current, action, referralId) {
  const pageFlow = getPageFlow(referralId);
  // if there is no current page meaning there was an error fetching referral data
  // then we are on an error state in the form and back should go back to appointments.
  const nextPageString = current
    ? pageFlow[current][action]
    : 'referralsAndRequests';
  const nextPage = pageFlow[nextPageString];
  if (action === 'next' && nextPageString === 'scheduleReferral') {
    startReferralTimer(referralId);
  }

  if (nextPage?.url) {
    history.push(nextPage.url);
  } else if (nextPage) {
    throw new Error(`Tried to route to a page without a url: ${nextPage}`);
  } else {
    throw new Error('Tried to route to page that does not exist');
  }
}

export function routeToPreviousReferralPage(
  history,
  current,
  referralId = null,
) {
  let resolvedReferralId = referralId;
  // Give the router some context to keep the user in the same referral when navigating back if not
  // explicitly passed
  if (!referralId && history.location?.search) {
    const params = new URLSearchParams(history.location.search);
    resolvedReferralId = params.get('id');
  }
  return routeToPageInFlow(history, current, 'previous', resolvedReferralId);
}

export function routeToNextReferralPage(history, current, referralId = null) {
  return routeToPageInFlow(history, current, 'next', referralId);
}

export function routeToCCPage(history, page, referralId = null) {
  const pageFlow = getPageFlow(referralId);
  const nextPage = pageFlow[page];
  return history.push(nextPage.url);
}

/* Function to get label from the flow
 * The URL displayed in the browser address bar is compared to the 
 * flow URL
 *
 * @export
 * @param {object} state 
 * @param {string} location - the pathname
 * @returns {string} the label string
 */

export function getReferralUrlLabel(state, location) {
  const _flow = getPageFlow();
  const home = '/';
  const results = Object.values(_flow).filter(
    value => location.pathname.endsWith(value.url) && value.url !== home,
  );

  if (results && results.length) {
    return results[0].label;
  }
  return null;
}

/**
 * Generates the breadcrumb information for a referral appointment flow.
 *
 * @param {object} location - The location object containing the current URL.
 * @param {string} currentPage - The current page identifier in the referral flow.
 * @param {string} referralId - The unique identifier for the referral.
 * @param {string} [categoryOfCare=''] - The category of care for the referral.
 * @returns {Object|null} The breadcrumb information including href, label, and useBackBreadcrumb flag, or null if the current page is not found in the flow.
 */
export const getReferralBreadcumb = (
  location,
  currentPage,
  referralId,
  categoryOfCare = '',
) => {
  const _flow = getPageFlow(referralId);
  const result = _flow[currentPage];

  if (!result) {
    return null;
  }
  const { useBackBreadcrumb } = result;

  return {
    href: useBackBreadcrumb ? '#' : location.href,
    label: result.breadcrumbText.replace(
      '{{ categoryOfCare }}',
      categoryOfCare,
    ),
    useBackBreadcrumb,
  };
};
