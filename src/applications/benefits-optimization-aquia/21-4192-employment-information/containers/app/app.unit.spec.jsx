/**
 * @module tests/containers/app.unit.spec
 * @description Unit tests for App container component
 * Tests feature toggle loading state handling including edge cases
 */

import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { App } from './app';

const mockStore = configureStore([]);

describe('21-4192 App', () => {
  let replaceStub;
  let originalLocation;

  const appLocation = {
    pathname: '/introduction',
    search: '',
    hash: '',
    action: 'POP',
    key: null,
    basename:
      '/disability/eligibility/special-claims/unemployability/submit-employment-information-form-21-4192',
    query: '{}',
  };

  const getData = ({
    loggedIn = true,
    savedForms = [],
    verified = true,
    data = {},
    pathname = '/introduction',
    isLoading = false,
    formEnabled = true,
  } = {}) => ({
    props: {
      location: { pathname, search: '' },
      children: <h1 data-testid="form-content">Form Content</h1>,
      router: { push: () => {} },
      routes: [{ path: pathname }],
    },
    storeData: {
      routes: [{ path: pathname }],
      user: {
        login: { currentlyLoggedIn: loggedIn },
        profile: {
          savedForms,
          verified,
          prefillsAvailable: [],
        },
      },
      form: {
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: { metadata: {} },
        data,
      },
      featureToggles: {
        loading: isLoading,
        // eslint-disable-next-line camelcase
        form_4192_enabled: formEnabled,
      },
    },
  });

  beforeEach(() => {
    // Save original location and set up mock that works in both Node 14 and 22
    originalLocation = window.location;
    replaceStub = sinon.stub();
    const desc =
      Object.getOwnPropertyDescriptor(window.location, 'replace') || {};
    if (desc.writable) {
      window.location.replace = replaceStub;
      window.location.href = 'http://localhost/';
    } else {
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: {
          replace: replaceStub,
          origin: 'http://localhost',
          pathname: '/',
          search: '',
          hash: '',
          href: 'http://localhost/',
        },
      });
    }
  });

  afterEach(() => {
    // Restore original location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  describe('Feature Toggle Loading States', () => {
    describe('when loading is undefined (initial state before fetch starts)', () => {
      it('should show loading indicator and NOT redirect', () => {
        const { props, storeData } = getData({ isLoading: undefined });
        // Set loading to undefined to simulate initial state
        storeData.featureToggles.loading = undefined;

        const { container } = render(
          <Provider store={mockStore(storeData)}>
            <App {...props} location={appLocation} />
          </Provider>,
        );

        expect($('va-loading-indicator', container)).to.exist;
        expect(replaceStub.called).to.be.false;
      });
    });

    describe('when loading is true (fetch in progress)', () => {
      it('should show loading indicator', () => {
        const { props, storeData } = getData({ isLoading: true });

        const { container } = render(
          <Provider store={mockStore(storeData)}>
            <App {...props} location={appLocation} />
          </Provider>,
        );

        expect($('va-loading-indicator', container)).to.exist;
        expect(replaceStub.called).to.be.false;
      });
    });

    describe('when loading is false (fetch completed)', () => {
      it('should render form content when formEnabled is true', () => {
        const { props, storeData } = getData({
          isLoading: false,
          formEnabled: true,
        });

        const { container, getByTestId } = render(
          <Provider store={mockStore(storeData)}>
            <App {...props} location={appLocation} />
          </Provider>,
        );

        expect($('va-loading-indicator', container)).to.not.exist;
        expect(replaceStub.called).to.be.false;
        expect(getByTestId('form-content')).to.exist;
      });

      it('should redirect when formEnabled is false', () => {
        const { props, storeData } = getData({
          isLoading: false,
          formEnabled: false,
        });

        render(
          <Provider store={mockStore(storeData)}>
            <App {...props} location={appLocation} />
          </Provider>,
        );

        expect(replaceStub.calledOnce).to.be.true;
        expect(replaceStub.calledWith('/find-forms/about-form-21-4192/')).to.be
          .true;
      });

      it('should redirect when formEnabled is undefined (flag missing)', () => {
        const { props, storeData } = getData({ isLoading: false });
        // eslint-disable-next-line camelcase
        storeData.featureToggles.form_4192_enabled = undefined;

        render(
          <Provider store={mockStore(storeData)}>
            <App {...props} location={appLocation} />
          </Provider>,
        );

        expect(replaceStub.calledOnce).to.be.true;
      });
    });
  });

  describe('Component Export', () => {
    it('should export App component', () => {
      expect(App).to.exist;
      expect(App).to.be.a('function');
    });

    it('should be a valid React component', () => {
      expect(App.name).to.equal('App');
    });
  });
});
