import api from './api';
import poaRequests from './mocks/poaRequests.json';
import user from './mocks/user.json';

const apiFetch = data => {
  return new Promise(resolve => {
    // Simulating network latency.
    setTimeout(() => resolve(data), 500);
  });
};

const mockApi = {
  getPOARequests({ status, sort }) {
    const filteredPoaRequests = poaRequests.filter(poaRequest => {
      if (status === 'completed' && sort === 'resolved_at_asc') {
        return poaRequest.resolution !== null;
      }
      if (status === 'completed' && sort === 'resolved_at_desc') {
        return poaRequest.resolution !== null;
      }
      if (status === 'pending' && sort === 'created_at_asc') {
        return poaRequest.resolution === null;
      }
      if (status === 'pending' && sort === 'created_at_desc') {
        return poaRequest.resolution === null;
      }
      throw new Error(`Unexpected status: ${status}`);
    });

    return apiFetch(filteredPoaRequests);
  },

  getPOARequest(id) {
    const poaRequest = poaRequests.find(r => r.id === id);
    return apiFetch(poaRequest);
  },

  getUser() {
    return apiFetch(user);
  },

  createPOARequestDecision(id, { type }) {
    const poaRequest = poaRequests.find(r => r.id === id);

    switch (type) {
      case 'acceptance':
        poaRequest.status = 'Accepted';
        break;
      case 'declination':
        poaRequest.status = 'Declined';
        break;
      default:
        throw new Error(`Unexpected decision type: ${type}`);
    }

    poaRequest.acceptedOrDeclinedAt = new Date().toISOString();

    return apiFetch({});
  },
};

// Convenience runtime toggle between use of mock data and real data.
let configured = false;
export function configure() {
  if (configured) return;
  configured = true;

  const search = new URLSearchParams(window.location.search);

  if (search.has('useMockUser')) {
    api.getUser = mockApi.getUser;
  }

  if (search.has('useMockData')) {
    Object.values(mockApi).forEach(method => {
      if (typeof method !== 'function') return;
      if (method.name === 'getUser') return;

      api[method.name] = method;
    });
  }
}

export default mockApi;
