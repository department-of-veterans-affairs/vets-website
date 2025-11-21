import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import IntroductionPage from '../../components/IntroductionPage';
import formConfig from '../../config/form';

const getStore = ({
  loggedIn = true,
  toggle = false,
  verified = false,
  savedForm = false,
} = {}) => ({
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
      savedStatus: '',
      loadedData: {
        metadata: {},
      },
      data: {},
    },
    featureToggles: {
      loading: false,
      [`burials_form_enabled`]: true,
      [`pbb_forms_require_loa3`]: toggle,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

const mockRoute = {
  pageList: [{ path: 'wrong-path' }, { path: 'testing' }],
  formConfig: {
    prefillEnabled: true,
    formId: formConfig.formId,
  },
};

describe('IntroductionPage', () => {
  it('renders the IntroductionPage component', () => {
    const screen = render(
      <Provider store={getStore({ loggedIn: false })}>
        <IntroductionPage
          route={mockRoute}
          location={{ basename: '/some-path' }}
        />
      </Provider>,
    );

    expect(
      screen.queryByText(
        'Apply for a Veterans burial allowance and transportation benefits',
      ),
    ).to.exist;
    expect(
      screen.queryByText(
        'Follow these steps to apply for a burial allowance and transportation benefits',
      ),
    ).to.exist;

    // logged in false, toggle false, verified false, saved form false
    expect($('va-alert-sign-in[variant="signInOptional"]', screen.container)).to
      .exist;
  });

  it('renders sign in required alert when not logged in & toggle on', () => {
    // logged in false, toggle true, verified false, saved form false
    const { container } = render(
      <Provider store={getStore({ loggedIn: false, toggle: true })}>
        <IntroductionPage
          route={mockRoute}
          location={{ basename: '/some-path' }}
        />
      </Provider>,
    );
    expect($('va-alert-sign-in[variant="signInRequired"]', container)).to.exist;
  });

  it('renders start action link when logged in, no saved form & toggle off', () => {
    // logged in true, toggle false, verified false, saved form false
    const { container } = render(
      <Provider store={getStore()}>
        <IntroductionPage
          route={mockRoute}
          location={{ basename: '/some-path' }}
        />
      </Provider>,
    );
    expect($('va-link-action, .vads-c-action-link--green', container)).to.exist;
  });

  it('renders continue app button when logged in, with saved form & toggle off', () => {
    // logged in true, toggle false, verified false, saved form true
    const { container } = render(
      <Provider store={getStore({ savedForm: true })}>
        <IntroductionPage
          route={mockRoute}
          location={{ basename: '/some-path' }}
        />
      </Provider>,
    );
    expect($('[data-testid="continue-your-application"]', container)).to.exist;
  });

  it('renders the IntroductionPage component (logged in, toggle on & not verified)', () => {
    // logged in true, toggle true, verified false, saved form false
    const { container } = render(
      <Provider store={getStore({ toggle: true })}>
        <IntroductionPage
          route={mockRoute}
          location={{ basename: '/some-path' }}
        />
      </Provider>,
    );
    expect($('va-alert-sign-in[variant="verifyIdMe"]', container)).to.exist;
  });

  it('renders continue app button when logged in, with saved form, verified & toggle on', () => {
    // logged in true, toggle true, verified true, saved form true
    const { container } = render(
      <Provider
        store={getStore({ toggle: true, savedForm: true, verified: true })}
      >
        <IntroductionPage
          route={mockRoute}
          location={{ basename: '/some-path' }}
        />
      </Provider>,
    );
    expect($('[data-testid="continue-your-application"]', container)).to.exist;
  });

  it('renders start action link when logged in & toggle on', () => {
    // logged in true, toggle true, verified true, saved form false
    const mockStore = getStore({
      loggedIn: true,
      toggle: true,
      verified: true,
      savedForm: false,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage
          route={mockRoute}
          location={{ basename: '/some-path' }}
        />
      </Provider>,
    );
    expect($('va-link-action, .vads-c-action-link--green', container)).to.exist;
  });
});
