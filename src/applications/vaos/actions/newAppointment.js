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

function routeToAppointmentPage(router, current, action) {
  return async (getState, dispatch) => {
    dispatch({
      type: FORM_PAGE_NAVIGATE_STARTED,
    });

    const nextAction = newAppointmentFlow[current][action];
    let nextState;

    if (typeof nextAction === 'string') {
      nextState = newAppointmentFlow[nextAction];
    } else {
      nextState = await newAppointmentFlow[nextAction](getState(), dispatch);
    }

    if (nextState.url) {
      router.push(nextState.url);
      dispatch({
        type: FORM_PAGE_NAVIGATE_COMPLETED,
      });
    } else {
      throw new Error(`Unrouteable state: ${nextState}`);
    }

    return nextState;
  };
}

export function routeToNextAppointmentPage(router, current) {
  return routeToAppointmentPage(router, current, 'next');
}

export function routeToPreviousAppointmentPage(router, current) {
  return routeToAppointmentPage(router, current, 'previous');
}
