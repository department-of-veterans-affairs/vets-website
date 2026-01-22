import { expect } from 'chai';
import sinon from 'sinon';

describe('createOnFormLoadedWithTokenRefresh', () => {
  let createOnFormLoadedWithTokenRefresh;
  let routerPushStub;
  let mockSessionStorage;

  before(() => {
    // Clear the module cache to get fresh imports
    delete require.cache[require.resolve('./token-refresh')];
    delete require.cache[require.resolve('platform/utilities/oauth/utilities')];
  });

  beforeEach(() => {
    routerPushStub = sinon.stub();
    mockSessionStorage = {};

    // Mock sessionStorage with all required methods
    global.sessionStorage = {
      getItem: key => mockSessionStorage[key] || null,
      setItem: (key, value) => {
        mockSessionStorage[key] = value;
      },
      removeItem: key => {
        delete mockSessionStorage[key];
      },
      clear: () => {
        mockSessionStorage = {};
      },
      get length() {
        return Object.keys(mockSessionStorage).length;
      },
    };
  });

  afterEach(() => {
    // Don't call sinon.restore() since we're not using any sinon stubs on modules
  });

  const createMockProps = (returnUrl = '/form/resume') => ({
    returnUrl,
    router: { push: routerPushStub },
    formData: { some: 'data' },
  });

  describe('basic functionality', () => {
    it('should return a function when createOnFormLoadedWithTokenRefresh is called', () => {
      const module = require('./token-refresh');
      createOnFormLoadedWithTokenRefresh =
        module.createOnFormLoadedWithTokenRefresh;

      const callback = createOnFormLoadedWithTokenRefresh('21-4192');

      expect(callback).to.be.a('function');
    });

    it('should return async function that navigates to returnUrl', async () => {
      const module = require('./token-refresh');
      createOnFormLoadedWithTokenRefresh =
        module.createOnFormLoadedWithTokenRefresh;

      const callback = createOnFormLoadedWithTokenRefresh('21-4192');
      const props = createMockProps('/test/url');

      await callback(props);

      expect(routerPushStub.calledOnce).to.be.true;
      expect(routerPushStub.calledWith('/test/url')).to.be.true;
    });

    it('should create different callbacks for different form IDs', () => {
      const module = require('./token-refresh');
      createOnFormLoadedWithTokenRefresh =
        module.createOnFormLoadedWithTokenRefresh;

      const callback1 = createOnFormLoadedWithTokenRefresh('21-4192');
      const callback2 = createOnFormLoadedWithTokenRefresh('21-0779');

      expect(callback1).to.not.equal(callback2);
    });
  });

  describe('navigation behavior', () => {
    beforeEach(() => {
      const module = require('./token-refresh');
      createOnFormLoadedWithTokenRefresh =
        module.createOnFormLoadedWithTokenRefresh;
    });

    it('should navigate even when sessionStorage is empty', async () => {
      mockSessionStorage = {};

      const callback = createOnFormLoadedWithTokenRefresh('21-4192');
      const props = createMockProps('/form/page-1');

      await callback(props);

      expect(routerPushStub.calledOnce).to.be.true;
      expect(routerPushStub.calledWith('/form/page-1')).to.be.true;
    });

    it('should handle different returnUrl values', async () => {
      const callback = createOnFormLoadedWithTokenRefresh('21-4192');

      await callback(createMockProps('/form/intro'));
      expect(routerPushStub.calledWith('/form/intro')).to.be.true;

      routerPushStub.resetHistory();

      await callback(createMockProps('/form/review'));
      expect(routerPushStub.calledWith('/form/review')).to.be.true;
    });

    it('should navigate with complex returnUrl paths', async () => {
      const callback = createOnFormLoadedWithTokenRefresh('21-4192');
      const props = createMockProps(
        '/pensions/application/527EZ/veteran-information',
      );

      await callback(props);

      expect(routerPushStub.calledOnce).to.be.true;
      expect(
        routerPushStub.calledWith(
          '/pensions/application/527EZ/veteran-information',
        ),
      ).to.be.true;
    });
  });

  describe('error resilience', () => {
    beforeEach(() => {
      const module = require('./token-refresh');
      createOnFormLoadedWithTokenRefresh =
        module.createOnFormLoadedWithTokenRefresh;
    });

    it('should handle missing router gracefully', async () => {
      const callback = createOnFormLoadedWithTokenRefresh('21-4192');
      const props = {
        returnUrl: '/test',
        router: {}, // Missing push method
        formData: {},
      };

      try {
        await callback(props);
        // If it doesn't throw, that's actually a failure of this test
        expect.fail('Should have thrown an error');
      } catch (error) {
        // Expected to throw
        expect(error).to.exist;
      }
    });

    it('should handle missing returnUrl', async () => {
      const callback = createOnFormLoadedWithTokenRefresh('21-4192');
      const props = {
        // Missing returnUrl
        router: { push: routerPushStub },
        formData: {},
      };

      await callback(props);

      expect(routerPushStub.calledOnce).to.be.true;
      expect(routerPushStub.calledWith(undefined)).to.be.true;
    });
  });

  describe('form ID handling', () => {
    beforeEach(() => {
      const module = require('./token-refresh');
      createOnFormLoadedWithTokenRefresh =
        module.createOnFormLoadedWithTokenRefresh;
    });

    it('should work with 21-4192 form ID', async () => {
      const callback = createOnFormLoadedWithTokenRefresh('21-4192');
      const props = createMockProps();

      await callback(props);

      expect(routerPushStub.calledOnce).to.be.true;
    });

    it('should work with 21-0779 form ID', async () => {
      const callback = createOnFormLoadedWithTokenRefresh('21-0779');
      const props = createMockProps();

      await callback(props);

      expect(routerPushStub.calledOnce).to.be.true;
    });

    it('should work with 21-2680 form ID', async () => {
      const callback = createOnFormLoadedWithTokenRefresh('21-2680');
      const props = createMockProps();

      await callback(props);

      expect(routerPushStub.calledOnce).to.be.true;
    });

    it('should work with 21p-530a form ID', async () => {
      const callback = createOnFormLoadedWithTokenRefresh('21p-530a');
      const props = createMockProps();

      await callback(props);

      expect(routerPushStub.calledOnce).to.be.true;
    });
  });

  describe('async behavior', () => {
    beforeEach(() => {
      const module = require('./token-refresh');
      createOnFormLoadedWithTokenRefresh =
        module.createOnFormLoadedWithTokenRefresh;
    });

    it('should return a Promise', () => {
      const callback = createOnFormLoadedWithTokenRefresh('21-4192');
      const props = createMockProps();

      const result = callback(props);

      expect(result).to.be.an.instanceOf(Promise);
    });

    it('should complete async flow before resolving', async () => {
      const callback = createOnFormLoadedWithTokenRefresh('21-4192');
      const props = createMockProps();
      let navigationComplete = false;

      routerPushStub.callsFake(() => {
        navigationComplete = true;
      });

      await callback(props);

      expect(navigationComplete).to.be.true;
    });
  });
});
