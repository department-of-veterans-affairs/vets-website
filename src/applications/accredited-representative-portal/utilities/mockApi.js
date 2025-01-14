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
  getPOARequests({ status }) {
    const filteredPoaRequests = poaRequests.filter(
      ({ attributes: poaRequest }) => {
        switch (status) {
          case 'completed':
            return ['Declined', 'Accepted'].includes(poaRequest.status);
          case 'pending':
            return poaRequest.status === 'Pending';
          default:
            throw new Error(`Unexpected status: ${status}`);
        }
      },
    );

    return apiFetch(filteredPoaRequests);
  },

  getPOARequest(id) {
    const poaRequest = poaRequests.find(r => r.id === +id);
    return apiFetch(poaRequest);
  },

  getUser() {
    return apiFetch(user);
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
    api.getPOARequest = mockApi.getPOARequest;
    api.getPOARequests = mockApi.getPOARequests;
  }
}

export default mockApi;
