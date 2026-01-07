import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
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
    originalLocation = window.location;
    sessionStorage.clear();
  });

  afterEach(() => {
    delete window.location;
    window.location = originalLocation;
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
    delete window.location;
    window.location = { search };
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

  it('should show legacy intro when rerouteFlag is true and ?rudisill=true in URL', () => {
    setWindowLocation('?rudisill=true');
    const { container } = render(
      <Provider store={createMockStore(true)}>
        <IntroductionRouter route={mockRoute} router={mockRouter} />
      </Provider>,
    );

    // IntroductionPageUpdate shows "Change your education benefits" title
    expect(container.textContent).to.include('Change your education benefits');
    expect(container.textContent).to.include('Equal to VA Form 22-1995');
    expect(sessionStorage.getItem('isRudisillFlow')).to.equal('true');
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

  it('should allow navigation back to questionnaire from Rudisill flow', () => {
    setWindowLocation('?rudisill=true');
    const { unmount } = render(
      <Provider store={createMockStore(true)}>
        <IntroductionRouter route={mockRoute} router={mockRouter} />
      </Provider>,
    );
    expect(sessionStorage.getItem('isRudisillFlow')).to.equal('true');
    unmount();

    setWindowLocation('');
    const { container } = render(
      <Provider store={createMockStore(true)}>
        <IntroductionRouter route={mockRoute} router={mockRouter} />
      </Provider>,
    );

    expect(container.textContent).to.include('Change your education benefits');
    expect(sessionStorage.getItem('isRudisillFlow')).to.be.null;
  });
});
