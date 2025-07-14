import {
  FORM_PAGE_CHANGE_COMPLETED,
  FORM_PAGE_CHANGE_STARTED,
  getReceivedDoseScreenerNextPage,
  getVAFacilityNextPage,
} from './redux/actions';

/**
 * Function to get new COVID appointment page flow.
 * The URL displayed in the browser address bar is changed when the feature flag
 * is true.
 *
 * @export
 * @returns {object} COVID appointment workflow object
 */
export default function getPageFlow() {
  return {
    clinicChoice: {
      url: 'clinic',
      label: 'Choose a clinic',
      next: 'selectDate1',
    },
    contactFacilities: {
      url: 'contact-facility',
      label: 'We can’t schedule your second dose online',
    },
    contactInfo: {
      url: 'contact-information',
      label: 'Confirm your contact information',
      next: 'review',
    },
    home: {
      url: '/schedule/type-of-care',
    },
    planAhead: {
      url: 'covid-vaccine/',
      next: 'receivedDoseScreener',
      label: 'COVID-19 vaccine appointment',
    },
    receivedDoseScreener: {
      url: 'doses-received',
      label: 'Have you received a COVID-19 vaccine?',
      next: getReceivedDoseScreenerNextPage(),
    },
    review: {
      url: 'review',
      label: 'Review your appointment details',
      next: '',
    },
    root: {
      url: '/my-health/appointments',
    },
    secondDosePage: {
      url: 'second-dose',
      label: 'When to plan for a second dose',
      next: 'contactInfo',
    },
    selectDate1: {
      url: 'date-time',
      label: 'Choose a date and time',
      next: 'secondDosePage',
    },
    vaFacility: {
      url: 'location',
      label: 'Choose a location',
      next: getVAFacilityNextPage(),
    },
  };
}

function routeToPageInFlow(history, current, action, data) {
  return async (dispatch, getState) => {
    const pageFlow = getPageFlow();

    dispatch({
      type: FORM_PAGE_CHANGE_STARTED,
      pageKey: current,
      data,
    });

    let nextPage;
    let nextStateKey;

    if (action === 'next') {
      const nextAction = pageFlow[current][action];
      if (typeof nextAction === 'string') {
        nextPage = pageFlow[nextAction];
        nextStateKey = nextAction;
      } else {
        nextStateKey = await nextAction(getState(), dispatch);
        nextPage = pageFlow[nextStateKey];
      }
    } else {
      const state = getState();
      const previousPage =
        state.covid19Vaccine.newBooking.previousPages[current];
      nextPage = pageFlow[previousPage];
    }

    if (nextPage?.url) {
      dispatch({
        type: FORM_PAGE_CHANGE_COMPLETED,
        pageKey: current,
        pageKeyNext: nextStateKey,
        direction: action,
      });
      history.push(nextPage.url);
    } else if (nextPage) {
      throw new Error(`Tried to route to a page without a url: ${nextPage}`);
    } else {
      throw new Error('Tried to route to page that does not exist');
    }
  };
}

export function routeToPreviousAppointmentPage(history, current, data) {
  return routeToPageInFlow(history, current, 'previous', data);
}

export function routeToNextAppointmentPage(history, current, data) {
  return routeToPageInFlow(history, current, 'next', data);
}

/* Function to get label from the flow
 * The URL displayed in the browser address bar is compared to the
 * flow URL
 *
 * @export
 * @param {string} location - the pathname
 * @returns {string} the label string
 */

export function getCovidUrlLabel(location) {
  const _flow = getPageFlow();
  const results = Object.values(_flow).filter(value =>
    location.pathname.endsWith(value.url),
  );
  if (results && results.length) {
    return results[0].label;
  }
  return null;
}
