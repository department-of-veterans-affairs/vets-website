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

  it('should show questionnaire when returning to intro without ?rudisill=true param', async () => {
    sessionStorage.setItem('isRudisillFlow', 'true');
    setWindowLocation('');
    // Store without formData flag - simulates fresh navigation back to intro
    const { container } = render(
      <Provider store={createMockStore(true)}>
        <IntroductionRouter route={mockRoute} router={mockRouter} />
      </Provider>,
    );
    // Routing is based on URL only, so should show questionnaire
    expect(container.textContent).to.include('Determine which form to use');
    // sessionStorage will be cleared by useEffect since no URL param and no saved form
    await waitFor(() => {
      expect(sessionStorage.getItem('isRudisillFlow')).to.be.null;
    });
  });
});
