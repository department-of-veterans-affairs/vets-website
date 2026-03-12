const { expect } = require('chai');
const sinon = require('sinon');

const {
  setupCommonMocks,
  mockGetApi,
  mockSubmitApi,
  mockInProgressForm,
} = require('./mockHelpers');

// Creates a mock Playwright page with a stubbed route method that records
// registered route handlers for inspection.
function createMockPage() {
  const routes = {};
  return {
    routes,
    route: sinon.stub().callsFake(async (pattern, handler) => {
      routes[pattern] = handler;
    }),
  };
}

// Creates a mock Playwright route for testing handler callbacks.
function createMockRoute(method = 'GET') {
  return {
    fulfill: sinon.stub().resolves(),
    fallback: sinon.stub().resolves(),
    request: () => ({ method: () => method }),
  };
}

describe('Playwright mockHelpers (unit)', () => {
  describe('setupCommonMocks', () => {
    it('registers routes for feature_toggles and maintenance_windows', async () => {
      const page = createMockPage();
      await setupCommonMocks(page);

      expect(page.route.callCount).to.equal(2);
      expect(page.route.firstCall.args[0]).to.equal('**/v0/feature_toggles*');
      expect(page.route.secondCall.args[0]).to.equal(
        '**/v0/maintenance_windows',
      );
    });

    it('fulfills feature_toggles with default empty features', async () => {
      const page = createMockPage();
      await setupCommonMocks(page);

      const route = createMockRoute();
      await page.routes['**/v0/feature_toggles*'](route);

      expect(route.fulfill.calledOnce).to.be.true;
      const body = JSON.parse(route.fulfill.firstCall.args[0].body);
      expect(body).to.deep.equal({ data: { features: [] } });
    });

    it('fulfills feature_toggles with custom data', async () => {
      const page = createMockPage();
      const custom = { data: { features: [{ name: 'flag', value: true }] } };
      await setupCommonMocks(page, { featureToggles: custom });

      const route = createMockRoute();
      await page.routes['**/v0/feature_toggles*'](route);

      const body = JSON.parse(route.fulfill.firstCall.args[0].body);
      expect(body).to.deep.equal(custom);
    });

    it('fulfills maintenance_windows with empty array', async () => {
      const page = createMockPage();
      await setupCommonMocks(page);

      const route = createMockRoute();
      await page.routes['**/v0/maintenance_windows'](route);

      const body = JSON.parse(route.fulfill.firstCall.args[0].body);
      expect(body).to.deep.equal({ data: [] });
    });
  });

  describe('mockGetApi', () => {
    it('fulfills GET requests with provided response', async () => {
      const page = createMockPage();
      const response = { data: { id: 1 } };
      await mockGetApi(page, '**/v0/test', response);

      const route = createMockRoute('GET');
      await page.routes['**/v0/test'](route);

      expect(route.fulfill.calledOnce).to.be.true;
      const args = route.fulfill.firstCall.args[0];
      expect(args.status).to.equal(200);
      expect(JSON.parse(args.body)).to.deep.equal(response);
    });

    it('falls back for non-GET requests', async () => {
      const page = createMockPage();
      await mockGetApi(page, '**/v0/test', {});

      const route = createMockRoute('POST');
      await page.routes['**/v0/test'](route);

      expect(route.fallback.calledOnce).to.be.true;
      expect(route.fulfill.called).to.be.false;
    });

    it('supports custom status codes', async () => {
      const page = createMockPage();
      await mockGetApi(page, '**/v0/test', { error: 'not found' }, 404);

      const route = createMockRoute('GET');
      await page.routes['**/v0/test'](route);

      expect(route.fulfill.firstCall.args[0].status).to.equal(404);
    });
  });

  describe('mockSubmitApi', () => {
    it('fulfills POST requests by default', async () => {
      const page = createMockPage();
      const response = { data: { success: true } };
      await mockSubmitApi(page, '**/v0/submit', response);

      const route = createMockRoute('POST');
      await page.routes['**/v0/submit'](route);

      expect(route.fulfill.calledOnce).to.be.true;
      expect(JSON.parse(route.fulfill.firstCall.args[0].body)).to.deep.equal(
        response,
      );
    });

    it('falls back for non-matching methods', async () => {
      const page = createMockPage();
      await mockSubmitApi(page, '**/v0/submit', {});

      const route = createMockRoute('GET');
      await page.routes['**/v0/submit'](route);

      expect(route.fallback.calledOnce).to.be.true;
    });

    it('supports custom method and status', async () => {
      const page = createMockPage();
      await mockSubmitApi(page, '**/v0/update', {}, 'PUT', 201);

      const route = createMockRoute('PUT');
      await page.routes['**/v0/update'](route);

      expect(route.fulfill.firstCall.args[0].status).to.equal(201);
    });
  });

  describe('mockInProgressForm', () => {
    it('fulfills GET with sipGetResponse', async () => {
      const page = createMockPage();
      const getRes = { formData: {} };
      const putRes = { data: { id: 1 } };
      await mockInProgressForm(page, '26-4555', getRes, putRes);

      const route = createMockRoute('GET');
      await page.routes['**/v0/in_progress_forms/26-4555'](route);

      expect(route.fulfill.calledOnce).to.be.true;
      expect(JSON.parse(route.fulfill.firstCall.args[0].body)).to.deep.equal(
        getRes,
      );
    });

    it('fulfills PUT with sipPutResponse', async () => {
      const page = createMockPage();
      const getRes = { formData: {} };
      const putRes = { data: { id: 1 } };
      await mockInProgressForm(page, '26-4555', getRes, putRes);

      const route = createMockRoute('PUT');
      await page.routes['**/v0/in_progress_forms/26-4555'](route);

      expect(JSON.parse(route.fulfill.firstCall.args[0].body)).to.deep.equal(
        putRes,
      );
    });

    it('falls back for other methods', async () => {
      const page = createMockPage();
      await mockInProgressForm(page, '10-10EZ', {}, {});

      const route = createMockRoute('DELETE');
      await page.routes['**/v0/in_progress_forms/10-10EZ'](route);

      expect(route.fallback.calledOnce).to.be.true;
    });
  });
});
