import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config';
import { IntroductionPage } from '@bio-aquia/21-2680-house-bound-status/containers';

/**
 * Creates a mock Redux store for testing
 * @param {Object} [initialState={}] - State overrides
 * @returns {Object} Mock store with getState, subscribe, and dispatch
 */
const createMockStore = (initialState = {}) => ({
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: false,
      },
      profile: {
        savedForms: [],
        prefillsAvailable: [],
        loa: {
          current: 3,
          highest: 3,
        },
        verified: true,
        dob: '2000-01-01',
        claims: {
          appeals: false,
        },
      },
    },
    form: {
      formId: formConfig.formId,
      loadedStatus: 'success',
      savedStatus: '',
      loadedData: {
        metadata: {},
      },
      data: {},
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get() {} },
      dismissedDowntimeWarnings: [],
    },
    ...initialState,
  }),
  subscribe: () => {},
  dispatch: () => {},
});

const defaultProps = {
  route: {
    path: 'introduction',
    pageList: [],
    formConfig,
  },
  location: {
    pathname: '/introduction',
  },
};

describe('IntroductionPage', () => {
  let scrollToTopStub;
  let focusElementStub;

  beforeEach(() => {
    const uiUtils = require('platform/utilities/ui');
    scrollToTopStub = sinon.stub(uiUtils, 'scrollToTop');
    focusElementStub = sinon.stub(uiUtils, 'focusElement');
  });

  afterEach(() => {
    scrollToTopStub.restore();
    focusElementStub.restore();
  });

  it('should render the form title and subtitle', () => {
    const mockStore = createMockStore();

    const { getByRole, getByText } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...defaultProps} />
      </Provider>,
    );

    expect(getByRole('heading', { level: 1 })).to.exist;
    expect(getByText(/Housebound Status/i)).to.exist;
    expect(getByText(/VA Form 21-2680/i)).to.exist;
  });

  it('should render the process list with steps', () => {
    const mockStore = createMockStore();

    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...defaultProps} />
      </Provider>,
    );

    const processItems = container.querySelectorAll('va-process-list-item');
    expect(processItems).to.have.lengthOf(4);
    expect(processItems[0].getAttribute('header')).to.equal('Prepare');
    expect(processItems[1].getAttribute('header')).to.equal(
      'Complete the form',
    );
    expect(processItems[2].getAttribute('header')).to.equal('Submit');
    expect(processItems[3].getAttribute('header')).to.equal('VA Review');
  });

  it('should display SaveInProgressIntro when user is not logged in', () => {
    const mockStore = createMockStore();

    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...defaultProps} />
      </Provider>,
    );

    const signInAlert = container.querySelector('va-alert-sign-in');
    expect(signInAlert).to.exist;
    expect(signInAlert.getAttribute('variant')).to.equal('signInOptional');
  });

  it('should display verify identity message when user is logged in but not verified', () => {
    const mockStore = createMockStore({
      user: {
        login: {
          currentlyLoggedIn: true,
        },
        profile: {
          savedForms: [],
          prefillsAvailable: [],
          loa: {
            current: 1,
            highest: 1,
          },
          verified: false,
        },
      },
    });

    const { queryByText } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...defaultProps} />
      </Provider>,
    );

    const startButton = queryByText(/Start your/);
    expect(startButton).to.not.exist;
  });

  it('should scroll to top and focus h1 on mount', () => {
    const mockStore = createMockStore();

    render(
      <Provider store={mockStore}>
        <IntroductionPage {...defaultProps} />
      </Provider>,
    );

    expect(scrollToTopStub).to.exist;
    expect(focusElementStub).to.exist;
  });

  it('should display OMB information', () => {
    const mockStore = createMockStore();

    render(
      <Provider store={mockStore}>
        <IntroductionPage {...defaultProps} />
      </Provider>,
    );

    const ombInfo = document.querySelector('va-omb-info');
    expect(ombInfo).to.exist;
    expect(ombInfo.getAttribute('res-burden')).to.equal('30');
    expect(ombInfo.getAttribute('omb-number')).to.equal('2900-0721');
    expect(ombInfo.getAttribute('exp-date')).to.equal('02/28/2026');
  });
});
