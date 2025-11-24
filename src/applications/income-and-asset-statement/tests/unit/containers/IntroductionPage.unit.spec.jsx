import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import IntroductionPage from '../../../containers/IntroductionPage';
import formConfig from '../../../config/form';

const getData = ({
  loggedIn = true,
  toggle = false,
  verified = false,
  savedForm = false,
} = {}) => ({
  props: {
    route: {
      formConfig,
      pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
    },
  },
  mockStore: {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {
          savedForms: savedForm
            ? [{ form: formConfig.formId, metadata: { expiresAt: 9999999999 } }]
            : [],
          prefillsAvailable: [],
          verified,
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
      featureToggles: {
        loading: false,
        [`pbb_forms_require_loa3`]: toggle,
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('<IntroductionPage />', () => {
  it('should render', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('h1', container)).to.exist;
    expect($('h1', container).textContent).to.eql(
      'Submit income and asset statement to support your claim',
    );
  });

  it('should show DIC eligibility link when not logged in', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container.innerHTML).to.include(
      'Find out if you’re eligible for VA Dependency and Indemnity Compensation',
    );
    // logged in false, toggle false, verified false, saved form false
    expect($('va-alert-sign-in[variant="signInOptional"]', container)).to.exist;
  });

  it('should not show DIC eligibility link when logged in', () => {
    const { props, mockStore } = getData({ loggedIn: true });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container.innerHTML).to.not.include(
      'Find out if you’re eligible for VA Dependency and Indemnity Compensation',
    );
  });

  it('should render SaveInProgressIntro start button text', () => {
    const { props, mockStore } = getData();
    const { getByText } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(getByText('Start the Income and Asset Statement application')).to
      .exist;
  });

  it('should render the OMB info element', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container.querySelector('va-omb-info')).to.exist;
  });

  it('should render the logged-in version of content (no accordion)', () => {
    const { props, mockStore } = getData({ loggedIn: true });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container.querySelector('va-accordion')).to.not.exist;
    expect(container.innerHTML).to.include(
      'Your spouse (unless you live apart, and you are estranged, and you do not contribute to your spouse’s support)',
    );
  });

  it('should render the accordion for logged-out users', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container.querySelector('va-accordion')).to.exist;
    expect(container.innerHTML).to.include('If you’re the Veteran');
  });

  // Checking LOA3 toggle
  it('renders sign in required alert when not logged in & toggle on', () => {
    // logged in false, toggle true, verified false, saved form false
    const { props, mockStore } = getData({ loggedIn: false, toggle: true });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('va-alert-sign-in[variant="signInRequired"]', container)).to.exist;
  });

  it('renders start action link when logged in, no saved form & toggle off', () => {
    // logged in true, toggle false, verified false, saved form false
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('va-link-action, .vads-c-action-link--green', container)).to.exist;
  });

  it('renders continue app button when logged in, with saved form & toggle off', () => {
    // logged in true, toggle false, verified false, saved form true
    const { props, mockStore } = getData({ savedForm: true });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('[data-testid="continue-your-application"]', container)).to.exist;
  });

  it('renders the verify alert (logged in, toggle on, not verified, no in progress)', () => {
    // logged in true, toggle true, verified false, saved form false
    const { props, mockStore } = getData({ toggle: true });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('va-alert-sign-in[variant="verifyIdMe"]', container)).to.exist;
  });

  it('renders the continue app button (logged in, toggle on, not verified & has in progress)', () => {
    // logged in true, toggle true, verified false, saved form true
    const { props, mockStore } = getData({ toggle: true, savedForm: true });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('[data-testid="continue-your-application"]', container)).to.exist;
  });

  it('renders continue app button when logged in, with saved form, verified & toggle on', () => {
    // logged in true, toggle true, verified true, saved form true
    const { props, mockStore } = getData({
      toggle: true,
      savedForm: true,
      verified: true,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('[data-testid="continue-your-application"]', container)).to.exist;
  });

  it('renders start action link when logged in & toggle on', () => {
    // logged in true, toggle true, verified true, saved form false
    const { props, mockStore } = getData({
      loggedIn: true,
      toggle: true,
      verified: true,
      savedForm: false,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('va-link-action, .vads-c-action-link--green', container)).to.exist;
  });
});
