import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import IntroductionPage from '../../containers/IntroductionPage';

const getData = ({ loggedIn = true, isVerified = true } = {}) => ({
  props: {
    loggedIn,
    location: {
      basename: '/sc-base-url',
    },
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
          savedForms: [],
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
      },
      scheduledDowntime: {
        globalDowntime: null,
        isReady: true,
        isPending: false,
        serviceMap: { get() {} },
        dismissedDowntimeWarnings: [],
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('IntroductionPage', () => {
  it('should render', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('h1', container).textContent).to.contain(
      'File a Supplemental Claim',
    );
    expect($('.va-introtext', container)).to.exist;
    expect($('va-process-list', container)).to.exist;
    expect($('va-omb-info', container)).to.exist;
  });

  it('should render one SIP alert when not logged in', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    // This SIP alert is _after_ the process list
    expect($$('.sip-wrapper .schemaform-sip-alert', container).length).to.eq(1);
    expect($('va-alert[status="warning"]', container)).to.not.exist;
  });

  it('should render verify identity alert', () => {
    const { props, mockStore } = getData({ isVerified: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('va-alert[status="warning"]', container)).to.exist;
    expect($('.schemaform-sip-alert', container)).to.not.exist;
  });

  it('should render top SIP alert with action links', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($$('.vads-c-action-link--green', container).length).to.eq(2);
    expect($('.schemaform-sip-alert', container).textContent).to.contain(
      'come back later to finish filling it out',
    );
    // Lower SiP alert not shown
    expect($('.sip-wrapper .schemaform-sip-alert', container)).to.not.exist;
    expect($('va-alert[status="warning"]', container)).to.not.exist;
  });
});
