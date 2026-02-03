import { DEMO_MODE_ACKNOWLEDGED } from '../constants';
import userFixture from '../fixtures/user.json';
import featureTogglesFixture from '../fixtures/feature-toggles.json';
import foldersFixture from '../fixtures/folders.json';
import accountStatusFixture from '../fixtures/account-status.json';
import personalInformationFixture from '../fixtures/personal-information.json';

// Routes marked with `requiresAcknowledgment: true` will only return mock data
// after the user has acknowledged the demo. This prevents showing "logged in"
// state on the intro page.
const mockRoutes = [
  {
    pattern: '/v0/user/mhv_user_account',
    data: accountStatusFixture,
    requiresAcknowledgment: true,
  },
  { pattern: '/v0/user', data: userFixture, requiresAcknowledgment: true },
  { pattern: '/v0/feature_toggles', data: featureTogglesFixture },
  { pattern: '/v0/maintenance_windows', data: { data: [] } },
  {
    pattern: '/my_health/v1/messaging/folders',
    data: foldersFixture,
    requiresAcknowledgment: true,
  },
  {
    pattern: '/v0/profile/personal_information',
    data: personalInformationFixture,
    requiresAcknowledgment: true,
  },
  { pattern: '/data/cms/vamc-ehr.json', data: '' },
];

function isAcknowledged() {
  return !!sessionStorage.getItem(DEMO_MODE_ACKNOWLEDGED);
}

function findMockResponse(url) {
  const urlString = typeof url === 'string' ? url : url?.url || '';
  const route = mockRoutes.find(r => urlString.includes(r.pattern));
  if (!route) return null;
  if (route.requiresAcknowledgment && !isAcknowledged()) return null;
  return route;
}

function createMockResponse(data) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default function setupMockApi() {
  const originalFetch = window.fetch.bind(window);

  window.fetch = (url, options) => {
    const mock = findMockResponse(url);
    if (mock) {
      return Promise.resolve(createMockResponse(mock.data));
    }
    return originalFetch(url, options);
  };
}
