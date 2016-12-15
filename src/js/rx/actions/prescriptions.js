import { apiRequest } from '../utils/helpers';

export function loadPrescription(id) {
  if (id) {
    const urls = [`/${id}`, `/${id}/trackings`];

    // Fetch both the prescription and its tracking history and
    // wait for retrieval and read of both resources to resolve.
    return dispatch => {
      dispatch({ type: 'LOADING_DETAIL' });

      Promise.all(urls.map(url => {
        return apiRequest(url).then(response => {
          return (response.ok) ? response.json() : Promise.reject();
        });
      })).then(
        data => dispatch({
          type: 'LOAD_PRESCRIPTION_SUCCESS',
          data: {
            rx: data[0].data,
            trackings: data[1].data
          }
        }),
        error => dispatch({ type: 'LOAD_PRESCRIPTION_FAILURE', error })
      );
    };
  }

  return dispatch => dispatch({ type: 'LOAD_PRESCRIPTION_FAILURE' });
}

export function loadPrescriptions(options) {
  let url = '';
  let defaultSort = '-refill_submit_date';
  const queries = [];

  // Construct segments of the final URL based on options passed in.
  if (options) {
    if (options.active) {
      url = `${url}/active`;
      defaultSort = 'prescription_name';
    }

    if (options.page) {
      queries.push(`page=${options.page}`);
    }
  }

  queries.push(`sort=${options.sort || defaultSort}`);

  // Append query parameters.
  if (queries.length > 0) {
    const queryString = queries.join('&');
    url = `${url}?${queryString}`;
  }

  return dispatch => {
    dispatch({
      type: options.active ? 'LOADING_ACTIVE' : 'LOADING_HISTORY'
    });

    apiRequest(url)
      .then(response => {
        return (response.ok) ? response.json() : Promise.reject();
      }).then(
        data => dispatch({
          type: 'LOAD_PRESCRIPTIONS_SUCCESS',
          active: options.active,
          data
        }),
        error => dispatch({
          type: 'LOAD_PRESCRIPTIONS_FAILURE',
          active: options.active,
          error
        })
      );
  };
}

export function refillPrescription(prescription) {
  if (prescription.prescriptionId) {
    const url = `/${prescription.prescriptionId}/refill`;

    window.dataLayer.push({
      event: 'rx-confirm-refill',
    });

    return dispatch => {
      dispatch({ type: 'REFILL_SUBMITTED' });

      apiRequest(url, { method: 'PATCH' })
      .then(response => {
        return (response.ok) ?
          Promise.resolve() :
          Promise.reject(response.json());
      }).then(
        () => dispatch({
          type: 'REFILL_SUCCESS',
          prescription
        }),
        response => dispatch({
          type: 'REFILL_FAILURE',
          errors: response.errors,
          prescription
        })
      );
    };
  }

  return dispatch => dispatch({ type: 'REFILL_FAILURE' });
}

export function sortPrescriptions(sort) {
  return { type: 'SORT_PRESCRIPTIONS', sort };
}
