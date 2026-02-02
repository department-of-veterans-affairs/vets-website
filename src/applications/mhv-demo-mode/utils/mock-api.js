import userFixture from '../fixtures/user.json';
import featureTogglesFixture from '../fixtures/feature-toggles.json';
import foldersFixture from '../fixtures/folders.json';
import accountStatusFixture from '../fixtures/account-status.json';
import personalInformationFixture from '../fixtures/personal-information.json';

const mockRoutes = [
  { pattern: '/v0/user/mhv_user_account', data: accountStatusFixture },
  { pattern: '/v0/user', data: userFixture },
  { pattern: '/v0/feature_toggles', data: featureTogglesFixture },
  { pattern: '/v0/maintenance_windows', data: { data: [] } },
  { pattern: '/my_health/v1/messaging/folders', data: foldersFixture },
  {
    pattern: '/v0/profile/personal_information',
    data: personalInformationFixture,
  },
  { pattern: '/data/cms/vamc-ehr.json', data: '' },
];

function findMockResponse(url) {
  const urlString = typeof url === 'string' ? url : url?.url || '';
  return mockRoutes.find(route => urlString.includes(route.pattern));
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
