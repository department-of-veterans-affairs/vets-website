import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import IntroductionPage from '../../containers/IntroductionPage';
import formConfig from '../../config/form';

import { FETCH_CONTESTABLE_ISSUES_SUCCEEDED } from '../../actions';
import { setHlrWizardStatus, removeHlrWizardStatus } from '../../wizard/utils';

const getData = ({
  loggedIn = true,
  isVerified = true,
  data = {},
  contestableIssues = [],
  status = FETCH_CONTESTABLE_ISSUES_SUCCEEDED,
  error = '',
} = {}) => ({
  props: {
    loggedIn,
    location: {
      basename: '/base-url',
    },
    route: {
      formConfig,
      pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
    },
  },
  mockStore: {
    getState: () => ({
      // getContestableIssues: () => {},
      isVerified,
      user: {
        login: {
          currentlyLoggedIn: loggedIn,
        },
        profile: {
          // need to have a saved form or else form will redirect to v2
          savedForms: [
            // {
            //   form: VA_FORM_IDS.FORM_20_0996,
            //   metadata: { lastUpdated: 3000, expiresAt: moment().unix() + 2000 },
            // },
          ],
          prefillsAvailable: [],
          verified: isVerified,
        },
      },
      form: {
        formId: formConfig.formId,
        loadedStatus: 'success',
        savedStatus: '',
        loadedData: {
          metadata: {},
        },
        data,
        contestableIssues,
      },
      contestableIssues: {
        status,
        error,
        issues: contestableIssues,
      },
      saveInProgress: {
        user: {},
      },
      location: {
        pathname: '/introduction',
      },
      saveInProgressActions: {},
      route: {
        formConfig: {
          verifyRequiredPrefill: true,
          savedFormMessages: {},
        },
        pageList: [],
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

const globalWin = {
  location: {
    pathname: '/introduction',
    replace: () => {},
  },
};

describe('IntroductionPage', () => {
  let oldWindow;
  let gaData;

  beforeEach(() => {
    oldWindow = global.window;
    global.window = Object.create(global.window);
    Object.assign(global.window, globalWin);
    global.window.dataLayer = [];
    gaData = global.window.dataLayer;
  });
  afterEach(() => {
    global.window = oldWindow;
    removeHlrWizardStatus();
  });

  it('should render', () => {
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
    const { props, mockStore } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('h1', container).textContent).to.contain(
      'Request a Higher-Level Review',
    );
    expect($('va-process-list', container)).to.exist;
    expect($('va-omb-info', container)).to.exist;
    expect($('.schemaform-sip-alert', container)).to.exist;
  });

  it('should render start action links', () => {
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($$('.vads-c-action-link--green', container).length).to.equal(2);
  });

  it('should render alert showing a server error', () => {
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
    const error = 'We can’t load your issues';
    const { props, mockStore } = getData({
      loggedIn: false,
      status: '',
      error,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} delay={0} />
      </Provider>,
    );

    const alert = $('va-alert', container);
    expect(alert.innerHTML).to.include(error);
    const recordedEvent = gaData[gaData.length - 1];
    expect(recordedEvent.event).to.equal('visible-alert-box');
    expect(recordedEvent['alert-box-heading']).to.include(error);
  });

  it('should show verify your account alert', () => {
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
    const { props, mockStore } = getData({ isVerified: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const verifyAlert = $('va-alert[status="warning"]', container);
    expect(verifyAlert.innerHTML).to.contain('href="/verify?');
  });

  it('should show contestable issue loading indicator', () => {
    setHlrWizardStatus(WIZARD_STATUS_COMPLETE);
    const { props, mockStore } = getData({ status: '' });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const loading = $('va-loading-indicator', container);
    expect(loading).to.exist;
    expect(loading.getAttribute('message')).to.eq(
      'Loading your previous decisions...',
    );
  });
});
