import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import IntroductionRouter from '../../containers/IntroductionRouter';

const middleware = [thunk];
const mockStore = configureStore(middleware);

describe('IntroductionRouter', () => {
  let originalLocation;

  const mockRoute = {
    formConfig: {
      formId: '22-1995',
      prefillEnabled: false,
      savedFormMessages: {},
    },
    pageList: [],
  };
  const mockRouter = { push: sinon.spy() };

  beforeEach(() => {
    originalLocation = global.window.location;
    sessionStorage.clear();
  });

  afterEach(() => {
    global.window.location = originalLocation;
    sessionStorage.clear();
  });

  const createMockStore = rerouteFlag =>
    mockStore({
      featureToggles: {
        loading: false,
        // eslint-disable-next-line camelcase
        meb_1995_re_reroute: rerouteFlag,
        // eslint-disable-next-line camelcase
        show_edu_benefits_1995_wizard: false,
      },
      form: {
        data: {},
        formId: '22-1995',
        loadedData: { metadata: { returnUrl: '/' } },
      },
      user: {
        login: { currentlyLoggedIn: false },
        profile: { savedForms: [], loading: false, prefillsAvailable: [] },
      },
    });

  const setWindowLocation = search => {
    delete global.window.location;
    let url = 'http://localhost';
    if (search) {
      url += search.startsWith('?') ? search : `?${search}`;
    }
    global.window.location = new URL(url);
  };

  it('should show questionnaire intro when rerouteFlag is true and no URL parameter', () => {
    setWindowLocation('');
    const { container } = render(
      <Provider store={createMockStore(true)}>
        <IntroductionRouter route={mockRoute} router={mockRouter} />
      </Provider>,
    );

    expect(container.textContent).to.include('Change your education benefits');
    expect(sessionStorage.getItem('isRudisillFlow')).to.be.null;
  });

  it('should show legacy intro when rerouteFlag is true and ?rudisill=true in URL', async () => {
    setWindowLocation('?rudisill=true');
    const { container } = render(
      <Provider store={createMockStore(true)}>
        <IntroductionRouter route={mockRoute} router={mockRouter} />
      </Provider>,
    );

    // Wait for useEffect to run and sessionStorage to be set
    await waitFor(() => {
      expect(sessionStorage.getItem('isRudisillFlow')).to.equal('true');
    });

    // IntroductionPageUpdate shows "Change your education benefits" title and legacy form text
    expect(container.textContent).to.include('Change your education benefits');
    expect(container.textContent).to.include('Equal to VA Form 22-1995');
  });

  it('should show legacy intro when rerouteFlag is false', () => {
    setWindowLocation('');
    const { container } = render(
      <Provider store={createMockStore(false)}>
        <IntroductionRouter route={mockRoute} router={mockRouter} />
      </Provider>,
    );

    // IntroductionPageUpdate shows "Change your education benefits" title
    expect(container.textContent).to.include('Change your education benefits');
    expect(container.textContent).to.include('Equal to VA Form 22-1995');
  });

  it('should clear sessionStorage when returning to intro without ?rudisill=true', () => {
    sessionStorage.setItem('isRudisillFlow', 'true');
    setWindowLocation('');

    render(
      <Provider store={createMockStore(true)}>
        <IntroductionRouter route={mockRoute} router={mockRouter} />
      </Provider>,
    );

    expect(sessionStorage.getItem('isRudisillFlow')).to.be.null;
  });

  it('should allow navigation back to questionnaire from Rudisill flow', async () => {
    // Step 1: User enters Rudisill flow
    setWindowLocation('?rudisill=true');
    const { unmount: unmount1 } = render(
      <Provider store={createMockStore(true)}>
        <IntroductionRouter route={mockRoute} router={mockRouter} />
      </Provider>,
    );

    // Wait for useEffect to set sessionStorage
    await waitFor(() => {
      expect(sessionStorage.getItem('isRudisillFlow')).to.equal('true');
    });

    unmount1();

    // Step 2: User navigates back to intro without parameter
    setWindowLocation('');
    sessionStorage.clear(); // Explicitly clear for test isolation

    const { container } = render(
      <Provider store={createMockStore(true)}>
        <IntroductionRouter route={mockRoute} router={mockRouter} />
      </Provider>,
    );

    // Should now show questionnaire intro (not legacy)
    expect(container.textContent).to.include('Change your education benefits');
    expect(container.textContent).to.include('Determine which form to use');
    expect(sessionStorage.getItem('isRudisillFlow')).to.be.null;
  });

  it('should show legacy intro when resuming saved Rudisill form', async () => {
    // Simulate save-in-progress with isRudisillFlow in formData
    const storeWithSavedRudisill = mockStore({
      featureToggles: {
        loading: false,
        // eslint-disable-next-line camelcase
        meb_1995_re_reroute: true,
        // eslint-disable-next-line camelcase
        show_edu_benefits_1995_wizard: false,
      },
      form: {
        data: {
          isRudisillFlow: true, // Saved Rudisill form
        },
        formId: '22-1995',
        loadedData: { metadata: { returnUrl: '/applicant/information' } },
      },
      user: {
        login: { currentlyLoggedIn: true },
        profile: { savedForms: [], loading: false, prefillsAvailable: [] },
      },
    });

    setWindowLocation(''); // No URL parameter
    sessionStorage.clear(); // No sessionStorage initially

    const { container } = render(
      <Provider store={storeWithSavedRudisill}>
        <IntroductionRouter route={mockRoute} router={mockRouter} />
      </Provider>,
    );

    // Wait for useEffect to restore sessionStorage from formData
    await waitFor(() => {
      expect(sessionStorage.getItem('isRudisillFlow')).to.equal('true');
    });

    // Should show legacy intro (not questionnaire) because formData has isRudisillFlow
    expect(container.textContent).to.include('Change your education benefits');
    expect(container.textContent).to.include('Equal to VA Form 22-1995');
    expect(container.textContent).to.not.include('Determine which form to use');
  });

  it('should not clear sessionStorage when user has a saved form', () => {
    sessionStorage.setItem('isRudisillFlow', 'true');
    setWindowLocation(''); // No URL parameter

    // Simulate user with a saved form in profile
    const storeWithSavedForm = mockStore({
      featureToggles: {
        loading: false,
        // eslint-disable-next-line camelcase
        meb_1995_re_reroute: true,
        // eslint-disable-next-line camelcase
        show_edu_benefits_1995_wizard: false,
      },
      form: {
        data: {},
        formId: '22-1995',
        loadedData: { metadata: { returnUrl: '/' } },
      },
      user: {
        login: { currentlyLoggedIn: true },
        profile: {
          savedForms: [{ form: '22-1995', metadata: {} }],
          loading: false,
          prefillsAvailable: [],
        },
      },
    });

    render(
      <Provider store={storeWithSavedForm}>
        <IntroductionRouter route={mockRoute} router={mockRouter} />
      </Provider>,
    );

    // sessionStorage should NOT be cleared because user has a saved form
    expect(sessionStorage.getItem('isRudisillFlow')).to.equal('true');
  });
});
