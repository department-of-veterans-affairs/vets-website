/**
 * Function to get referral page flow.
 *
 * @export
 * @param {boolean} state - New COVID appointment state
 * @returns {object} Referral appointment workflow object
 */
export default function getPageFlow(referralId) {
  return {
    appointments: {
      url: '/appointments',
      label: 'Appointments',
      next: 'referralReview',
      previous: '',
    },
    activeReferrals: {
      url: '/appointments/pending',
      label: 'Active referrals',
      next: 'referralReview',
      previous: 'appointments',
    },
    referralReview: {
      url: `/referral-review/${referralId}`,
      label: 'Review your referral',
      next: 'scheduleAppointment',
      previous: 'activeReferrals',
    },
    scheduleAppointment: {
      url: '/provider-choose-date-and-time',
      label: 'Schedule and appointment with your provider',
      next: 'confirmAppointment',
      previous: 'referralReview',
    },
    confirmAppointment: {
      url: '/confirm-approved',
      label: 'Confirm your appointment',
      next: 'appointments',
      previous: 'scheduleAppointment',
    },
    complete: {
      url: 'appointments/[ID]?confirmMsg=true',
      label: 'Your appointment is scheduled',
      next: '',
      previous: 'confirmAppointment',
    },
  };
}

export function routeToPageInFlow(history, current, action, referralId) {
  const pageFlow = getPageFlow(referralId);
  const nextPageString = pageFlow[current][action];
  const nextPage = pageFlow[nextPageString];

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
  return routeToPageInFlow(history, current, 'previous', referralId);
}

export function routeToNextReferralPage(history, current, referralId = null) {
  return routeToPageInFlow(history, current, 'next', referralId);
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
