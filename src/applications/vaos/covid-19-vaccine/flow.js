import {
  FORM_PAGE_CHANGE_COMPLETED,
  FORM_PAGE_CHANGE_STARTED,
  getReceivedDoseScreenerNextPage,
  getVAFacilityNextPage,
} from './redux/actions';

/**
 * Function to get COVID appointment page flow.
 * The URL displayed in the browser address bar is changed when the feature flag
 * is true.
 *
 * @export
 * @param {boolean} state - COVID appointment state
 * @returns {object} COVID appointment workflow object
 */
export default function getPageFlow() {
  return {
    clinicChoice: {
      url: 'clinic',
      next: 'selectDate1',
    },
    contactFacilities: {
      url: 'contact-facility',
    },
    contactInfo: {
      url: 'contact-information',
      next: 'review',
    },
    home: {
      url: '/schedule/type-of-care',
    },
    planAhead: {
      url: './',
      next: 'receivedDoseScreener',
    },
    receivedDoseScreener: {
      url: 'doses-received',
      next: getReceivedDoseScreenerNextPage(),
    },
    review: {
      url: 'review',
      next: '',
    },
    root: {
      url: '/my-health/appointments',
    },
    secondDosePage: {
      url: 'second-dose',
      next: 'contactInfo',
    },
    selectDate1: {
      url: 'date-time',
      next: 'secondDosePage',
    },
    vaFacility: {
      url: 'location',
      next: getVAFacilityNextPage(),
    },
  };
}

export function routeToPageInFlow(history, current, action, data) {
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
