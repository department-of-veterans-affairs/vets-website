import { startReferralTimer } from './utils/timer';

/**
 * Function to get referral page flow.
 *
 * @export
 * @returns {object} Referral appointment workflow object
 */
export default function getPageFlow() {
  return {
    appointments: {
      url: '/',
      label: 'Appointments',
      next: 'scheduleReferral',
      previous: '',
    },
    referralsAndRequests: {
      url: '/referrals-requests',
      label: 'Requests and referrals',
      next: 'scheduleReferral',
      previous: 'appointments',
    },
    scheduleReferral: {
      url: `/schedule-referral`,
      label: 'Referral for {{ categoryOfCare }}',
      next: 'scheduleAppointment',
      previous: 'referralsAndRequests',
    },
    scheduleAppointment: {
      url: `/schedule-referral/date-time`,
      label: 'Schedule an appointment with your provider',
      next: 'reviewAndConfirm',
      previous: 'scheduleReferral',
    },
    reviewAndConfirm: {
      url: `/schedule-referral/review`,
      label: 'Review your appointment details',
      next: 'complete',
      previous: 'scheduleAppointment',
    },
    complete: {
      url: `/schedule-referral/complete`,
      label: 'Your appointment is scheduled',
      next: '',
      previous: 'appointments',
    },
  };
}

export function routeToPageInFlow(history, current, action, referralId) {
  const pageFlow = getPageFlow();
  // if there is no current page meaning there was an error fetching referral data
  // then we are on an error state in the form and back should go back to appointments.
  const nextPageString = current
    ? pageFlow[current][action]
    : 'referralsAndRequests';
  const nextPage = pageFlow[nextPageString];
  if (action === 'next' && nextPageString === 'scheduleReferral') {
    startReferralTimer(referralId);
  }

  const params = new URLSearchParams();
  if (referralId && current !== 'complete') {
    params.append('id', referralId);
  }
  if (current === 'reviewAndConfirm' && action === 'next') {
    params.append('confirmMsg', 'true');
  }

  let nextPageUrl = nextPage?.url;

  if (nextPageUrl) {
    if (params.size) {
      nextPageUrl += `?${params.toString()}`;
    }
    history.push(nextPageUrl);
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
  const pageFlow = getPageFlow();
  const nextPage = pageFlow[page];
  let nextPageUrl = nextPage.url;

  if (referralId) {
    const params = new URLSearchParams();
    params.append('id', referralId);
    nextPageUrl += `?${params.toString()}`;
  }
  return history.push(nextPageUrl);
}

/* Function to get label from the flow
 * The URL displayed in the browser address bar is compared to the 
 * flow URL
 *
 * @export
 * @param {string} location - the pathname
 * @param {string} categoryOfCare - the category of care
 * @returns {string} the label string
 */

export function getReferralUrlLabel(location, categoryOfCare = '') {
  const _flow = getPageFlow();
  const home = '/';
  const results = Object.values(_flow).filter(
    value => location.pathname.endsWith(value.url) && value.url !== home,
  );

  if (results && results.length) {
    const [result] = results;
    const { url, label } = result;
    if (url.startsWith('/schedule-referral/')) {
      return url.endsWith('complete') ? 'Back to appointments' : 'Back';
    }
    return label.replace('{{ categoryOfCare }}', categoryOfCare);
  }
  return null;
}
