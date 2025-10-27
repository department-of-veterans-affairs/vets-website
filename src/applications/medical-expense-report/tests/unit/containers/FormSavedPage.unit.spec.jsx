import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import FormSavedPage from '../../../containers/FormSavedPage';
import formConfig from '../../../config/form';

describe('Medical Expense Report FormSavedPage', () => {
  const { formId } = formConfig;
  const path = '/veteran-information';

  const defaultProps = {
    route: {
      pageList: [{}, { path }],
      formConfig,
    },
    router: {
      push: () => {},
      replace: () => {},
      go: () => {},
      goBack: () => {},
      goForward: () => {},
      setRouteLeaveHook: () => {},
      isActive: () => {},
      location: { pathname: path },
    },
  };

  const createMockStore = (options = {}) => {
    const {
      expirationDate = '2025-12-01T00:00:00.000Z',
      hasItf = true,
    } = options;

    const state = {
      form: {
        formId,
        lastSavedDate: Date.now(),
        expirationDate: (Date.now() + 1000 * 60 * 60 * 24) / 1000, // unix time
        loadedData: { metadata: { returnUrl: path } },
        ...(hasItf && {
          itf: {
            currentITF: {
              expirationDate,
            },
          },
        }),
      },
      user: {
        profile: {
          prefillsAvailable: [formId],
        },
      },
    };

    return createStore(storeState => storeState, state);
  };

  afterEach(() => {
    // Clean up after each test
  });

  it('should render FormSaved component with expiration message when ITF exists', () => {
    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <FormSavedPage {...defaultProps} />
      </Provider>,
    );

    // Should render the main FormSaved alert
    expect($('va-alert', container)).to.exist;

    // Should show expiration message with formatted date
    expect($('.expires-container', container)).to.exist;
    expect($('.expires', container)).to.exist;
    expect($('.expires', container).textContent).to.include('December 1, 2025');

    // Should contain instruction text about submission deadline
    expect(container.textContent).to.include('Submit your application by');
    expect(container.textContent).to.include(
      'you may have a later effective date for benefits',
    );
  });

  it('should render problem message when no ITF is found', () => {
    const store = createMockStore({ hasItf: false });

    const { container } = render(
      <Provider store={store}>
        <FormSavedPage {...defaultProps} />
      </Provider>,
    );

    // Should render the main FormSaved alert
    expect($('va-alert', container)).to.exist;

    // Should not show expires container
    expect($('.expires-container', container)).to.not.exist;

    // Should show ITF contact information
    expect($('.itf-contact-container', container)).to.exist;
    expect(container.textContent).to.include(
      'Veterans Pension application right now',
    );
    expect(container.textContent).to.include('confirm your intent to file');

    // Should include contact information
    expect($('va-telephone', container)).to.exist;
  });

  it('should render problem message when ITF exists but has no expiration date', () => {
    const store = createMockStore({ expirationDate: null });

    const { container } = render(
      <Provider store={store}>
        <FormSavedPage {...defaultProps} />
      </Provider>,
    );

    // Should render the main FormSaved alert
    expect($('va-alert', container)).to.exist;

    // Should not show expires container
    expect($('.expires-container', container)).to.not.exist;

    // Should show ITF contact information
    expect($('.itf-contact-container', container)).to.exist;
    expect(container.textContent).to.include('confirm your intent to file');
  });

  it('should handle different expiration date formats', () => {
    const store = createMockStore({
      expirationDate: '2025-06-15T12:30:00.000Z',
    });

    const { container } = render(
      <Provider store={store}>
        <FormSavedPage {...defaultProps} />
      </Provider>,
    );

    expect($('.expires', container).textContent).to.include('June 15, 2025');
  });

  it('should render telephone components for contact information', () => {
    const store = createMockStore({ hasItf: false });

    const { container } = render(
      <Provider store={store}>
        <FormSavedPage {...defaultProps} />
      </Provider>,
    );

    // Should have telephone components for VA benefits and TTY
    const telephones = container.querySelectorAll('va-telephone');
    expect(telephones.length).to.be.greaterThan(0);

    // Check for TTY telephone component
    const ttyPhone = container.querySelector('va-telephone[tty]');
    expect(ttyPhone).to.exist;
  });

  it('should pass props correctly to FormSaved component', () => {
    const customProps = {
      ...defaultProps,
      testProp: 'test-value',
    };

    const store = createMockStore();

    const { container } = render(
      <Provider store={store}>
        <FormSavedPage {...customProps} />
      </Provider>,
    );

    // Component should render without errors
    expect($('va-alert', container)).to.exist;
  });

  it('should handle empty ITF state gracefully', () => {
    const state = {
      form: {
        formId,
        lastSavedDate: Date.now(),
        expirationDate: (Date.now() + 1000 * 60 * 60 * 24) / 1000,
        loadedData: { metadata: { returnUrl: path } },
        itf: {}, // Empty ITF object
      },
      user: {
        profile: {
          prefillsAvailable: [formId],
        },
      },
    };

    const store = createStore(storeState => storeState, state);

    const { container } = render(
      <Provider store={store}>
        <FormSavedPage {...defaultProps} />
      </Provider>,
    );

    // Should render without crashing and show problem message
    expect($('va-alert', container)).to.exist;
    expect(container.textContent).to.include('confirm your intent to file');
  });
});
