import { repData } from 'applications/personalization/view-representative/static/representative-dummy';

export const FETCH_REPRESENTATIVE_STARTED = 'FETCH_REPRESENTATIVE_STARTED';
export const FETCH_REPRESENTATIVE_SUCCESS = 'FETCH_REPRESENTATIVE_SUCCESS';
export const FETCH_REPRESENTATIVE_FAILED = 'FETCH_REPRESENTATIVE_FAILED';

// TODO: Wire up to vets-api once endpoint is up.
const mockRepresentative = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve({ data: repData });
    }, 4000);
  });

export const fetchRepresentative = () => async dispatch => {
  dispatch({
    type: FETCH_REPRESENTATIVE_STARTED,
    response: true,
  });
  const response = await mockRepresentative();
  if (response.errors) {
    dispatch({ type: FETCH_REPRESENTATIVE_FAILED, response });
  } else {
    dispatch({ type: FETCH_REPRESENTATIVE_SUCCESS, response });
  }
};
