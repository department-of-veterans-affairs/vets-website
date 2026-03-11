const { expect } = require('chai');
const sinon = require('sinon');

const { login, defaultMockUser } = require('./login');

// Creates a mock Playwright page with route + addInitScript stubs.
function createMockPage() {
  const routes = {};
  return {
    routes,
    addInitScript: sinon.stub().resolves(),
    route: sinon.stub().callsFake(async (pattern, handler) => {
      routes[pattern] = handler;
    }),
  };
}

function createMockRoute(method = 'GET') {
  return {
    fulfill: sinon.stub().resolves(),
    request: () => ({ method: () => method }),
  };
}

describe('Playwright login helpers (unit)', () => {
  describe('defaultMockUser', () => {
    it('is a valid user scaffold object', () => {
      expect(defaultMockUser).to.have.property('data');
      expect(defaultMockUser.data.type).to.equal('users_scaffolds');
    });

    it('has loa.current of 3', () => {
      expect(defaultMockUser.data.attributes.profile.loa.current).to.equal(3);
    });

    it('includes expected services', () => {
      const { services } = defaultMockUser.data.attributes;
      expect(services).to.include('facilities');
      expect(services).to.include('hca');
      expect(services).to.include('messaging');
    });

    it('has veteran status', () => {
      const { veteran_status: vs } = defaultMockUser.data.attributes;
      expect(vs.is_veteran).to.be.true;
      expect(vs.served_in_military).to.be.true;
    });
  });

  describe('login', () => {
    it('calls addInitScript to set hasSession', async () => {
      const page = createMockPage();
      await login(page);

      expect(page.addInitScript.calledOnce).to.be.true;
    });

    it('mocks the /v0/user endpoint', async () => {
      const page = createMockPage();
      await login(page);

      expect(page.route.calledOnce).to.be.true;
      expect(page.route.firstCall.args[0]).to.equal('**/v0/user');
    });

    it('fulfills /v0/user with default mock user', async () => {
      const page = createMockPage();
      await login(page);

      const route = createMockRoute();
      await page.routes['**/v0/user'](route);

      const body = JSON.parse(route.fulfill.firstCall.args[0].body);
      expect(body.data.type).to.equal('users_scaffolds');
      expect(body.data.attributes.profile.first_name).to.equal('Jane');
    });

    it('fulfills /v0/user with custom user data', async () => {
      const page = createMockPage();
      const custom = { data: { id: 'custom', type: 'test' } };
      await login(page, custom);

      const route = createMockRoute();
      await page.routes['**/v0/user'](route);

      const body = JSON.parse(route.fulfill.firstCall.args[0].body);
      expect(body).to.deep.equal(custom);
    });
  });
});
