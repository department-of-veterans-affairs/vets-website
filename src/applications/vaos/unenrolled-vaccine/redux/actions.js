import unenrolledVaccineFlow from '../flow';

export const FORM_PAGE_CHANGE_STARTED =
  'projectCheetah/FORM_PAGE_CHANGE_STARTED';
export const START_APPOINTMENT_FLOW = 'projectCheetah/START_APPOINTMENT_FLOW';
export const FORM_PAGE_CHANGE_COMPLETED =
  'projectCheetah/FORM_PAGE_CHANGE_COMPLETED';
export const FORM_RESET = 'projectCheetah/FORM_RESET';
export const FORM_SUBMIT = 'projectCheetah/FORM_SUBMIT';
export const FORM_SUBMIT_FAILED = 'projectCheetah/FORM_SUBMIT_FAILED';

export const GA_FLOWS = {
  DIRECT: 'direct',
};

export function routeToPageInFlow(flow, history, current, action) {
  return async (dispatch, getState) => {
    dispatch({
      type: FORM_PAGE_CHANGE_STARTED,
      pageKey: current,
    });

    let nextPage;
    let nextStateKey;

    if (action === 'next') {
      const nextAction = flow[current][action];
      if (typeof nextAction === 'string') {
        nextPage = flow[nextAction];
        nextStateKey = nextAction;
      } else {
        nextStateKey = await nextAction(getState(), dispatch);
        nextPage = flow[nextStateKey];
      }
    } else {
      const state = getState();
      const previousPage = state.unenrolledVaccine.previousPages[current];
      nextPage = flow[previousPage];
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

export function routeToNextAppointmentPage(history, current) {
  return routeToPageInFlow(unenrolledVaccineFlow, history, current, 'next');
}

export function routeToPreviousAppointmentPage(history, current) {
  return routeToPageInFlow(unenrolledVaccineFlow, history, current, 'previous');
}
