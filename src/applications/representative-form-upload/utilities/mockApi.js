import api from './api';
import user from './mocks/user.json';

const apiFetch = data => {
  return new Promise(resolve => {
    // Simulating network latency.
    setTimeout(() => resolve(data), 500);
  });
};

const mockApi = {
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
    Object.values(mockApi).forEach(method => {
      if (typeof method !== 'function') return;
      if (method.name === 'getUser') return;

      api[method.name] = method;
    });
  }
}

export default mockApi;
