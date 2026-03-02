import { expect } from 'chai';
import sinon from 'sinon';

import {
  // Constants
  DEFAULT_DELAY,
  // Helpers
  delay,
  mockApi,
  apiUrl,
  // Handler factories
  createUserHandler,
  createUnauthenticatedUserHandler,
  createFeatureTogglesHandler,
  createMaintenanceWindowsHandler,
  createVamcEhrHandler,
  createCommonHandlers,
  createCommonHandlersUnauthenticated,
  // Pre-configured handlers
  userHandler,
  unauthenticatedUserHandler,
  featureTogglesHandler,
  maintenanceWindowsHandler,
  vamcEhrHandler,
  commonHandlers,
  commonHandlersUnauthenticated,
  // Re-exported mock data
  mockUser,
  mockUserLOA1,
  mockUserUnauthenticated,
  mockFeatureToggles,
} from '../browser';

describe('platform/mocks/browser', () => {
  describe('delay helper', () => {
    it('should call ctx.delay with DEFAULT_DELAY when no ms provided', () => {
      const mockCtx = { delay: sinon.stub().returns('delay-result') };

      const result = delay(mockCtx);

      expect(mockCtx.delay.calledOnce).to.be.true;
      expect(mockCtx.delay.calledWith(DEFAULT_DELAY)).to.be.true;
      expect(result).to.equal('delay-result');
    });

    it('should call ctx.delay with custom ms when provided', () => {
      const mockCtx = { delay: sinon.stub().returns('delay-result') };

      delay(mockCtx, 2000);

      expect(mockCtx.delay.calledWith(2000)).to.be.true;
    });

    it('should call ctx.delay with 0 for instant responses', () => {
      const mockCtx = { delay: sinon.stub().returns('delay-result') };

      delay(mockCtx, 0);

      expect(mockCtx.delay.calledWith(0)).to.be.true;
    });
  });

  describe('apiUrl', () => {
    it('should be defined and be a string', () => {
      expect(apiUrl).to.be.a('string');
    });
  });

  describe('mockApi', () => {
    it('should have all HTTP method helpers', () => {
      expect(mockApi.get).to.be.a('function');
      expect(mockApi.post).to.be.a('function');
      expect(mockApi.put).to.be.a('function');
      expect(mockApi.patch).to.be.a('function');
      expect(mockApi.delete).to.be.a('function');
      expect(mockApi.head).to.be.a('function');
      expect(mockApi.options).to.be.a('function');
    });

    it('should create handlers with apiUrl prefix', () => {
      const handler = () => {};
      const result = mockApi.get('/v0/test', handler);

      // MSW handlers have an info object with the path
      expect(result.info.path).to.equal(`${apiUrl}/v0/test`);
      expect(result.info.method).to.equal('GET');
    });

    it('should create POST handler with apiUrl prefix', () => {
      const handler = () => {};
      const result = mockApi.post('/v0/submit', handler);

      expect(result.info.path).to.equal(`${apiUrl}/v0/submit`);
      expect(result.info.method).to.equal('POST');
    });

    it('should create PUT handler with apiUrl prefix', () => {
      const handler = () => {};
      const result = mockApi.put('/v0/update', handler);

      expect(result.info.path).to.equal(`${apiUrl}/v0/update`);
      expect(result.info.method).to.equal('PUT');
    });

    it('should create DELETE handler with apiUrl prefix', () => {
      const handler = () => {};
      const result = mockApi.delete('/v0/remove', handler);

      expect(result.info.path).to.equal(`${apiUrl}/v0/remove`);
      expect(result.info.method).to.equal('DELETE');
    });
  });

  describe('handler factories', () => {
    describe('createUserHandler', () => {
      it('should return a handler function', () => {
        const handler = createUserHandler();
        expect(handler).to.be.an('object');
        expect(handler.info.path).to.include('/v0/user');
        expect(handler.info.method).to.equal('GET');
      });

      it('should use custom baseUrl when provided', () => {
        const handler = createUserHandler('http://custom-api.local');
        expect(handler.info.path).to.equal('http://custom-api.local/v0/user');
      });
    });

    describe('createUnauthenticatedUserHandler', () => {
      it('should return a handler function', () => {
        const handler = createUnauthenticatedUserHandler();
        expect(handler.info.path).to.include('/v0/user');
        expect(handler.info.method).to.equal('GET');
      });

      it('should use custom baseUrl when provided', () => {
        const handler = createUnauthenticatedUserHandler(
          'http://custom-api.local',
        );
        expect(handler.info.path).to.equal('http://custom-api.local/v0/user');
      });
    });

    describe('createFeatureTogglesHandler', () => {
      it('should return a handler function', () => {
        const handler = createFeatureTogglesHandler();
        expect(handler.info.path).to.include('/v0/feature_toggles');
        expect(handler.info.method).to.equal('GET');
      });

      it('should use wildcard pattern for query params', () => {
        const handler = createFeatureTogglesHandler();
        expect(handler.info.path).to.include('*');
      });
    });

    describe('createMaintenanceWindowsHandler', () => {
      it('should return a handler function', () => {
        const handler = createMaintenanceWindowsHandler();
        expect(handler.info.path).to.include('/v0/maintenance_windows');
        expect(handler.info.method).to.equal('GET');
      });
    });

    describe('createVamcEhrHandler', () => {
      it('should return a handler function', () => {
        const handler = createVamcEhrHandler();
        expect(handler.info.path).to.include('/data/cms/vamc-ehr.json');
        expect(handler.info.method).to.equal('GET');
      });

      it('should use custom baseUrl when provided', () => {
        const handler = createVamcEhrHandler(null, 'http://custom-api.local');
        expect(handler.info.path).to.equal(
          'http://custom-api.local/data/cms/vamc-ehr.json',
        );
      });

      it('should accept array of facilities', () => {
        const facilities = [
          { id: 'vha_663', title: 'Seattle VA', system: 'vista' },
        ];
        const handler = createVamcEhrHandler(facilities);
        expect(handler).to.be.an('object');
        expect(handler.info.method).to.equal('GET');
      });

      it('should accept full response object', () => {
        const fullResponse = {
          data: { nodeQuery: { count: 1, entities: [] } },
        };
        const handler = createVamcEhrHandler(fullResponse);
        expect(handler).to.be.an('object');
      });
    });
  });

  describe('handler collections', () => {
    describe('createCommonHandlers', () => {
      it('should return an array of 4 handlers', () => {
        const handlers = createCommonHandlers();
        expect(handlers).to.be.an('array');
        expect(handlers).to.have.lengthOf(4);
      });

      it('should include user, featureToggles, maintenanceWindows, and vamcEhr handlers', () => {
        const handlers = createCommonHandlers();
        const paths = handlers.map(h => h.info.path);

        expect(paths.some(p => p.includes('/v0/user'))).to.be.true;
        expect(paths.some(p => p.includes('/v0/feature_toggles'))).to.be.true;
        expect(paths.some(p => p.includes('/v0/maintenance_windows'))).to.be
          .true;
        expect(paths.some(p => p.includes('/data/cms/vamc-ehr.json'))).to.be
          .true;
      });

      it('should use custom baseUrl when provided', () => {
        const handlers = createCommonHandlers('http://custom-api.local');
        handlers.forEach(handler => {
          expect(handler.info.path).to.include('http://custom-api.local');
        });
      });
    });

    describe('createCommonHandlersUnauthenticated', () => {
      it('should return an array of 4 handlers', () => {
        const handlers = createCommonHandlersUnauthenticated();
        expect(handlers).to.be.an('array');
        expect(handlers).to.have.lengthOf(4);
      });

      it('should include user endpoint (for 401 response)', () => {
        const handlers = createCommonHandlersUnauthenticated();
        const paths = handlers.map(h => h.info.path);

        expect(paths.some(p => p.includes('/v0/user'))).to.be.true;
      });
    });
  });

  describe('pre-configured handlers', () => {
    it('should export userHandler', () => {
      expect(userHandler).to.be.an('object');
      expect(userHandler.info.path).to.include('/v0/user');
    });

    it('should export unauthenticatedUserHandler', () => {
      expect(unauthenticatedUserHandler).to.be.an('object');
      expect(unauthenticatedUserHandler.info.path).to.include('/v0/user');
    });

    it('should export featureTogglesHandler', () => {
      expect(featureTogglesHandler).to.be.an('object');
      expect(featureTogglesHandler.info.path).to.include('/v0/feature_toggles');
    });

    it('should export maintenanceWindowsHandler', () => {
      expect(maintenanceWindowsHandler).to.be.an('object');
      expect(maintenanceWindowsHandler.info.path).to.include(
        '/v0/maintenance_windows',
      );
    });

    it('should export vamcEhrHandler', () => {
      expect(vamcEhrHandler).to.be.an('object');
      expect(vamcEhrHandler.info.path).to.include('/data/cms/vamc-ehr.json');
    });

    it('should export commonHandlers array', () => {
      expect(commonHandlers).to.be.an('array');
      expect(commonHandlers).to.have.lengthOf(4);
    });

    it('should export commonHandlersUnauthenticated array', () => {
      expect(commonHandlersUnauthenticated).to.be.an('array');
      expect(commonHandlersUnauthenticated).to.have.lengthOf(4);
    });
  });

  describe('re-exported mock data', () => {
    it('should re-export mockUser from responses', () => {
      expect(mockUser).to.be.an('object');
      expect(mockUser.data.type).to.equal('users');
    });

    it('should re-export mockUserLOA1 from responses', () => {
      expect(mockUserLOA1).to.be.an('object');
      expect(mockUserLOA1.data.attributes.profile.loa.current).to.equal(1);
    });

    it('should re-export mockUserUnauthenticated from responses', () => {
      expect(mockUserUnauthenticated).to.be.an('object');
      expect(mockUserUnauthenticated.errors[0].status).to.equal('401');
    });

    it('should re-export mockFeatureToggles from responses', () => {
      expect(mockFeatureToggles).to.be.an('object');
      expect(mockFeatureToggles.data.type).to.equal('feature_toggles');
    });
  });
});
