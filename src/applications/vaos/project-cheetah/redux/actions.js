import newBookingFlow from '../flow';

export const FORM_PAGE_OPENED = 'projectCheetah/FORM_PAGE_OPENED';
export const FORM_DATA_UPDATED = 'projectCheetah/FORM_DATA_UPDATED';
export const FORM_PAGE_CHANGE_STARTED =
  'projectCheetah/FORM_PAGE_CHANGE_STARTED';
export const FORM_PAGE_CHANGE_COMPLETED =
  'projectCheetah/FORM_PAGE_CHANGE_COMPLETED';
export const FORM_RESET = 'projectCheetah/FORM_RESET';
export const FORM_SUBMIT = 'projectCheetah/FORM_SUBMIT';
export const FORM_SUBMIT_SUCCEEDED = 'projectCheetah/FORM_SUBMIT_SUCCEEDED';
export const FORM_SUBMIT_FAILED = 'projectCheetah/FORM_SUBMIT_FAILED';

export function openFormPage(page, uiSchema, schema) {
  return {
    type: FORM_PAGE_OPENED,
    page,
    uiSchema,
    schema,
  };
}

export function updateFormData(page, uiSchema, data) {
  return {
    type: FORM_DATA_UPDATED,
    page,
    uiSchema,
    data,
  };
}

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
      const previousPage =
        state.projectCheetah.newBooking.previousPages[current];
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
  return routeToPageInFlow(newBookingFlow, history, current, 'next');
}

export function routeToPreviousAppointmentPage(history, current) {
  return routeToPageInFlow(newBookingFlow, history, current, 'previous');
}
