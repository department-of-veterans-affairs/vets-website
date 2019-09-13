import newAppointmentFlow from '../newAppointmentFlow';

export const FORM_DATA_UPDATED = 'newAppointment/FORM_DATA_UPDATED';
export const FORM_PAGE_OPENED = 'newAppointment/FORM_PAGE_OPENED';
export const FORM_PAGE_NAVIGATE_STARTED =
  'newAppointment/FORM_PAGE_NAVIGATE_STARTED';
export const FORM_PAGE_NAVIGATE_COMPLETED =
  'newAppointment/FORM_PAGE_NAVIGATE_COMPLETED';

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

export function routeToPage(flow, router, current, action) {
  return async (dispatch, getState) => {
    dispatch({
      type: FORM_PAGE_NAVIGATE_STARTED,
    });

    const nextAction = flow[current][action];
    let nextState;

    if (typeof nextAction === 'string') {
      nextState = flow[nextAction];
    } else {
      const nextStateKey = await nextAction(getState(), dispatch);
      nextState = flow[nextStateKey];
    }

    if (nextState?.url) {
      router.push(nextState.url);
      dispatch({
        type: FORM_PAGE_NAVIGATE_COMPLETED,
      });
    } else if (nextState) {
      throw new Error(`Tried to route to a page without a url: ${nextState}`);
    } else {
      throw new Error('Tried to route to page that does not exist');
    }

    return nextState;
  };
}

export function routeToNextAppointmentPage(router, current) {
  return routeToPage(newAppointmentFlow, router, current, 'next');
}

export function routeToPreviousAppointmentPage(router, current) {
  return routeToPage(newAppointmentFlow, router, current, 'previous');
}
