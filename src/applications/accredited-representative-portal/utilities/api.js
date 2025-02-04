import { apiRequest } from 'platform/utilities/api';

const API_VERSION = 'accredited_representative_portal/v0';

/**
 * This abstraction was introduced to let us pass fetch options to API methods
 * so that we could forward an abort signal from route loaders. This abstraction
 * only accomodates inner functions that don't have default parameters.
 *
 * Not every API method needs to be defined using this abstraction. Furthermore,
 * it is okay to refactor this abstraction, or even just unwind it altogether,
 * if that seems justified.
 */
const wrapApiRequest = fn => {
  return (...args) => {
    const optionsFromCaller = args[fn.length] || {};
    const [resource, optionsFromFn = {}] = fn(...args.slice(0, fn.length));

    const options = {
      apiVersion: API_VERSION,
      ...optionsFromFn,
      ...optionsFromCaller,
    };

    return apiRequest(resource, options);
  };
};

const api = {
  getPOARequests: wrapApiRequest(query => {
    const urlQuery = new URLSearchParams(query).toString();
    return [`/power_of_attorney_requests?${urlQuery}`];
  }),

  getPOARequest: wrapApiRequest(id => {
    return [`/power_of_attorney_requests/${id}`];
  }),

  getUser: wrapApiRequest(() => {
    return ['/user'];
  }),

  createPOARequestDecision: wrapApiRequest((id, decision) => {
    return [
      `/power_of_attorney_requests/${id}/decision`,
      {
        body: JSON.stringify({ decision }),
        method: 'POST',
      },
    ];
  }),
};

export default api;
