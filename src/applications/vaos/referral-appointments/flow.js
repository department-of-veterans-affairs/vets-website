import { startReferralTimer } from './utils/timer';

/**
 * Function to get referral page flow.
 *
 * @export
 * @param {string} referralId - The referral unique identifier
 * @param {string} appointmentId - The appointment unique identifier
 * @returns {object} Referral appointment workflow object
 */
export function getPageFlow(referralId, appointmentId) {
  return {
    error: {
      url: '/',
      label: 'Back to appointments',
      next: '',
      previous: 'appointments',
    },
    appointments: {
      url: '/',
      label: 'Appointments',
      next: 'scheduleReferral',
      previous: '',
    },
    referralsAndRequests: {
      url: '/referrals-requests',
      label: 'Referrals and requests',
      next: 'scheduleReferral',
      previous: 'appointments',
    },
    scheduleReferral: {
      url: `/schedule-referral?id=${referralId}`,
      label: 'Appointment Referral',
      next: 'scheduleAppointment',
      previous: 'referralsAndRequests',
    },
    scheduleAppointment: {
      url: `/schedule-referral/date-time?id=${referralId}`,
      label: 'Schedule an appointment with your provider',
      next: 'reviewAndConfirm',
      previous: 'scheduleReferral',
    },
    reviewAndConfirm: {
      url: `/schedule-referral/review?id=${referralId}`,
      label: 'Review your appointment details',
      next: 'complete',
      previous: 'scheduleAppointment',
    },
    complete: {
      url: `/schedule-referral/complete/${appointmentId}?id=${referralId}`,
      label: 'Your appointment is scheduled',
      next: 'details',
      previous: 'appointments',
    },
    details: {
      url: `/${appointmentId}?eps=true`,
      label: '',
      next: '',
      previous: 'complete',
    },
  };
}

export function routeToPageInFlow(
  history,
  current,
  action,
  referralId,
  appointmentId,
) {
  const pageFlow = getPageFlow(referralId, appointmentId);
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

export function routeToNextReferralPage(
  history,
  current,
  referralId = null,
  appointmentId = null,
) {
  return routeToPageInFlow(history, current, 'next', referralId, appointmentId);
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
 * @param {string} currentPage - the current page in the referral flow
 * @returns {string} the label string
 */

export function getReferralUrlLabel(currentPage) {
  const _flow = getPageFlow();
  const result = _flow[currentPage];

  switch (currentPage) {
    case 'complete':
      return 'Back to appointments';
    case 'reviewAndConfirm':
    case 'scheduleAppointment':
      return 'Back';
    default:
      if (!result) {
        return null;
      }
      return result.label;
  }
}
