import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import { IntroductionPageRedirect } from '../../containers/IntroductionPageRedirect';

const middleware = [thunk];
const mockStore = configureStore(middleware);

describe('IntroductionPageRedirect', () => {
  const mockRouter = { push: sinon.spy() };
  const mockRoute = {
    formConfig: {
      formId: '22-1995',
      prefillEnabled: false,
      savedFormMessages: {},
    },
    pageList: [],
  };

  const createMockStore = (rerouteFlag, user) => {
    return mockStore({
      featureToggles: {
        loading: false,
        // eslint-disable-next-line camelcase
        meb_1995_re_reroute: rerouteFlag,
      },
      form: {
        data: {},
        formId: '22-1995',
        loadedData: {
          metadata: {
            returnUrl: '/',
          },
        },
        migrations: [],
        prefillTransformer: null,
        lastSavedDate: null,
      },
      user,
    });
  };

  it('should return null when rerouteFlag is false', () => {
    const store = createMockStore(false, {
      login: { currentlyLoggedIn: false },
      profile: { savedForms: [], loading: false, prefillsAvailable: [] },
    });

    const { container } = render(
      <Provider store={store}>
        <IntroductionPageRedirect route={mockRoute} router={mockRouter} />
      </Provider>,
    );

    expect(container.querySelector('.schemaform-intro')).to.not.exist;
  });

  it('should render the introduction page when rerouteFlag is true', () => {
    const store = createMockStore(true, {
      login: { currentlyLoggedIn: false },
      profile: { savedForms: [], loading: false, prefillsAvailable: [] },
    });

    const { container } = render(
      <Provider store={store}>
        <IntroductionPageRedirect route={mockRoute} router={mockRouter} />
      </Provider>,
    );

    expect(container.querySelector('.schemaform-intro')).to.exist;
    expect(container.textContent).to.include('Change your education benefits');
    expect(container.textContent).to.include('Determine which form to use');
  });

  it('should show start button and prefill alert for authenticated users', () => {
    const store = createMockStore(true, {
      login: { currentlyLoggedIn: true },
      profile: {
        savedForms: [],
        loading: false,
        prefillsAvailable: [],
      },
    });

    const { container } = render(
      <Provider store={store}>
        <IntroductionPageRedirect route={mockRoute} router={mockRouter} />
      </Provider>,
    );

    expect(
      container.querySelector(
        "va-link-action[text='Start your questionnaire']",
      ),
    ).to.exist;
    expect(container.textContent).to.include(
      'We’ve prefilled some of your information',
    );
    // Container should still render with the form
    expect(container.querySelector('.schemaform-intro')).to.exist;
  });

  it('should render for unauthenticated users', () => {
    const store = createMockStore(true, {
      login: { currentlyLoggedIn: false },
      profile: { savedForms: [], loading: false, prefillsAvailable: [] },
    });

    const { container } = render(
      <Provider store={store}>
        <IntroductionPageRedirect route={mockRoute} router={mockRouter} />
      </Provider>,
    );

    expect(container.textContent).to.include('Change your education benefits');
    // Should not show prefill alert for unauthenticated users
    expect(container.textContent).to.not.include(
      'We’ve prefilled some of your information',
    );
  });

  describe('handleStartQuestionnaire', () => {
    it('should call router.push with the correct startPage when initial conditions are met', () => {
      const routerPushSpy = sinon.spy();
      const testRouter = { push: routerPushSpy };

      const routeWithPages = {
        ...mockRoute,
        pageList: [{ path: '/first-page' }, { path: '/second-page' }],
      };

      const store = createMockStore(true, {
        login: { currentlyLoggedIn: true },
        profile: {
          savedForms: [
            {
              form: '22-1995',
              metadata: {
                expiresAt: Math.floor(Date.now() / 1000) + 86400,
                lastUpdated: Math.floor(Date.now() / 1000),
              },
            },
          ],
          loading: false,
          prefillsAvailable: [],
        },
      });

      const { container } = render(
        <Provider store={store}>
          <IntroductionPageRedirect
            route={routeWithPages}
            router={testRouter}
          />
        </Provider>,
      );

      const linkAction = container.querySelector('va-link-action');
      linkAction.click();

      expect(routerPushSpy.calledOnce).to.be.true;
      expect(routerPushSpy.firstCall.args[0]).to.equal('/second-page');
    });

    it('should handle scenarios where formData is empty when determining the starting page', () => {
      const routerPushSpy = sinon.spy();
      const testRouter = { push: routerPushSpy };

      const routeWithPages = {
        ...mockRoute,
        pageList: [{ path: '/first-page' }, { path: '/second-page' }],
      };

      const store = mockStore({
        featureToggles: {
          loading: false,
          // eslint-disable-next-line camelcase
          meb_1995_re_reroute: true,
        },
        form: {
          data: {},
          formId: '22-1995',
          loadedData: {
            metadata: {
              returnUrl: '/',
            },
          },
          migrations: [],
          prefillTransformer: null,
          lastSavedDate: null,
        },
        user: {
          login: { currentlyLoggedIn: true },
          profile: {
            savedForms: [
              {
                form: '22-1995',
                metadata: {
                  expiresAt: Math.floor(Date.now() / 1000) + 86400,
                  lastUpdated: Math.floor(Date.now() / 1000),
                },
              },
            ],
            loading: false,
            prefillsAvailable: [],
          },
        },
      });

      const { container } = render(
        <Provider store={store}>
          <IntroductionPageRedirect
            route={routeWithPages}
            router={testRouter}
          />
        </Provider>,
      );

      const linkAction = container.querySelector('va-link-action');
      linkAction.click();

      expect(routerPushSpy.calledOnce).to.be.true;
      expect(routerPushSpy.firstCall.args[0]).to.equal('/second-page');
    });

    it('should handle scenarios where formData is undefined when determining the starting page', () => {
      const routerPushSpy = sinon.spy();
      const testRouter = { push: routerPushSpy };

      const routeWithPages = {
        ...mockRoute,
        pageList: [{ path: '/first-page' }, { path: '/second-page' }],
      };

      const store = mockStore({
        featureToggles: {
          loading: false,
          // eslint-disable-next-line camelcase
          meb_1995_re_reroute: true,
        },
        form: {
          data: undefined,
          formId: '22-1995',
          loadedData: {
            metadata: {
              returnUrl: '/',
            },
          },
          migrations: [],
          prefillTransformer: null,
          lastSavedDate: null,
        },
        user: {
          login: { currentlyLoggedIn: true },
          profile: {
            savedForms: [
              {
                form: '22-1995',
                metadata: {
                  expiresAt: Math.floor(Date.now() / 1000) + 86400,
                  lastUpdated: Math.floor(Date.now() / 1000),
                },
              },
            ],
            loading: false,
            prefillsAvailable: [],
          },
        },
      });

      const { container } = render(
        <Provider store={store}>
          <IntroductionPageRedirect
            route={routeWithPages}
            router={testRouter}
          />
        </Provider>,
      );

      const linkAction = container.querySelector('va-link-action');
      linkAction.click();

      expect(routerPushSpy.calledOnce).to.be.true;
      // Should still work with undefined formData, defaulting to empty object
      expect(routerPushSpy.firstCall.args[0]).to.equal('/second-page');
    });
  });

  describe('propTypes validation', () => {
    it('should ensure router prop with push function is provided as per propTypes', () => {
      const routerPushSpy = sinon.spy();
      const testRouter = { push: routerPushSpy };

      const store = createMockStore(true, {
        login: { currentlyLoggedIn: false },
        profile: { savedForms: [], loading: false, prefillsAvailable: [] },
      });

      // Should render without errors when router with push is provided
      const { container } = render(
        <Provider store={store}>
          <IntroductionPageRedirect route={mockRoute} router={testRouter} />
        </Provider>,
      );

      expect(container.querySelector('.schemaform-intro')).to.exist;
      expect(testRouter.push).to.be.a('function');
    });
  });
});
