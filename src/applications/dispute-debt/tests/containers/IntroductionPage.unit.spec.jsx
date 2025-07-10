import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import formConfig from '../../config/form';
import IntroductionPage from '../../containers/IntroductionPage';

const props = {
  route: {
    path: 'introduction',
    pageList: [],
    formConfig,
  },
  userLoggedIn: false,
  userIdVerified: true,
};

const createMockStore = ({ featureToggles = {} } = {}) => ({
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
    featureToggles: {
      loading: false,
      // eslint-disable-next-line camelcase
      dispute_debt: true,
      ...featureToggles,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('IntroductionPage', () => {
  it('should render', () => {
    const mockStore = createMockStore();
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });

  it('should show loading indicator while feature flags are loading', () => {
    const mockStore = createMockStore({
      featureToggles: {
        loading: true,
        // eslint-disable-next-line camelcase
        dispute_debt: true,
      },
    });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const loadingIndicator = container.querySelector('va-loading-indicator');
    expect(loadingIndicator).to.exist;
    expect(loadingIndicator.getAttribute('message')).to.equal(
      'Loading application...',
    );
  });

  it('should show form content when feature flag is enabled', () => {
    const mockStore = createMockStore({
      featureToggles: {
        loading: false,
        // eslint-disable-next-line camelcase
        dispute_debt: true,
      },
    });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const introText = container.querySelector('.va-introtext');
    expect(introText).to.exist;
    expect(introText.textContent).to.include('Use this form if you');
    expect(introText.textContent).to.include(
      'like to dispute all or part of the debt',
    );
  });

  it('should show unavailable alert when feature flag is disabled', () => {
    const mockStore = createMockStore({
      featureToggles: {
        loading: false,
        // eslint-disable-next-line camelcase
        dispute_debt: false,
      },
    });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const alert = container.querySelector('va-alert[status="error"]');
    expect(alert).to.exist;

    const headline = alert.querySelector('h2[slot="headline"]');
    expect(headline).to.exist;
    expect(headline.textContent).to.include('sorry');
    expect(headline.textContent).to.include('application is unavailable');
  });

  it('should not show unavailable alert while feature flags are loading', () => {
    const mockStore = createMockStore({
      featureToggles: {
        loading: true,
        // eslint-disable-next-line camelcase
        dispute_debt: false, // Even though flag is false, should not show alert while loading
      },
    });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const loadingIndicator = container.querySelector('va-loading-indicator');
    expect(loadingIndicator).to.exist;

    const alert = container.querySelector('va-alert[status="error"]');
    expect(alert).to.not.exist;
  });
});
