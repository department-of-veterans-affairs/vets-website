import {
  FORM_PAGE_CHANGE_COMPLETED,
  FORM_PAGE_CHANGE_STARTED,
  getReceivedDoseScreenerNextPage,
  getVAFacilityNextPage,
} from './redux/actions';
import { selectFeatureBreadcrumbUrlUpdate } from '../redux/selectors';

/**
 * Function to get new COVID appointment page flow.
 * The URL displayed in the browser address bar is changed when the feature flag
 * is true.
 *
 * @export
 * @param {boolean} state - New COVID appointment state
 * @returns {object} COVID appointment workflow object
 */
export default function getPageFlow(state) {
  const featureBreadcrumbUrlUpdate = selectFeatureBreadcrumbUrlUpdate(state);

  return {
    clinicChoice: {
      url: featureBreadcrumbUrlUpdate
        ? 'clinic'
        : '/new-covid-19-vaccine-appointment/choose-clinic',
      label: 'Choose a clinic',
      next: 'selectDate1',
    },
    contactFacilities: {
      url: featureBreadcrumbUrlUpdate
        ? 'contact-facility'
        : '/new-covid-19-vaccine-appointment/contact-facility',
      label: 'We can’t schedule your second dose online',
    },
    contactInfo: {
      url: featureBreadcrumbUrlUpdate
        ? 'contact-information'
        : '/new-covid-19-vaccine-appointment/contact-info',
      label: 'Confirm your contact information',
      next: 'review',
    },
    home: {
      url: featureBreadcrumbUrlUpdate
        ? '/schedule/type-of-care'
        : '/new-appointment',
    },
    planAhead: {
      url: featureBreadcrumbUrlUpdate
        ? './'
        : '/new-covid-19-vaccine-appointment',
      next: 'receivedDoseScreener',
    },
    receivedDoseScreener: {
      url: featureBreadcrumbUrlUpdate
        ? 'doses-received'
        : '/new-covid-19-vaccine-appointment/confirm-doses-received',
      label: 'Have you received a COVID-19 vaccine?',
      next: getReceivedDoseScreenerNextPage(),
    },
    review: {
      url: featureBreadcrumbUrlUpdate
        ? 'review'
        : '/new-covid-19-vaccine-appointment/review',
      label: 'Review your appointment details',
      next: '',
    },
    root: {
      url: featureBreadcrumbUrlUpdate
        ? '/my-health/appointments'
        : '/health-care/schedule-view-va-appointments/appointments/',
    },
    secondDosePage: {
      url: featureBreadcrumbUrlUpdate
        ? 'second-dose'
        : '/new-covid-19-vaccine-appointment/second-dose-info',
      label: 'When to plan for a second dose',
      next: 'contactInfo',
    },
    selectDate1: {
      url: featureBreadcrumbUrlUpdate
        ? 'date-time'
        : '/new-covid-19-vaccine-appointment/select-date',
      label: 'Choose a date and time',
      next: 'secondDosePage',
    },
    vaFacility: {
      url: featureBreadcrumbUrlUpdate
        ? 'location'
        : '/new-covid-19-vaccine-appointment/choose-facility',
      label: 'Choose a location',
      next: getVAFacilityNextPage(),
    },
  };
}

export function routeToPageInFlow(history, current, action, data) {
  return async (dispatch, getState) => {
    const pageFlow = getPageFlow(getState());

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
 * @param {object} state 
 * @param {string} location - the pathname
 * @returns {string} the label string
 */

export function getCovidUrlLabel(state, location) {
  const _flow = getPageFlow(state);
  const home = '/';
  const results = Object.values(_flow).filter(
    value => location.pathname.endsWith(value.url) && value.url !== home,
  );

  if (results && results.length) {
    return results[0].label;
  }
  return null;
}
