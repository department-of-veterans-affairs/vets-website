import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import IntroductionPage from '../../containers/IntroductionPage';

const getData = ({
  loggedIn = true,
  isVerified = true,
  dob = '2000-01-01',
  canAppeal = true,
} = {}) => ({
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
          dob,
          claims: {
            appeals: canAppeal,
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
    expect($('.sip-wrapper', container)).to.exist;
  });

  it('should render one SIP alert when not logged in', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    // This SIP alert is _after_ the process list
    expect($$('va-alert[status="info"]', container).length).to.eq(1);
    expect($$('va-alert[status="info"]', container)[0].textContent).to.include(
      'Sign in now',
    );
    expect($('va-alert[status="warning"]', container)).to.not.exist;
  });

  it('should render verify identity alert', () => {
    const { props, mockStore } = getData({ isVerified: false });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('va-alert[status="continue"]', container)).to.exist;
    expect($('.schemaform-sip-alert', container)).to.not.exist;
    expect($('.sip-wrapper', container)).to.not.exist;
  });

  it('should render missing SSN alert', () => {
    const { props, mockStore } = getData({ canAppeal: '' });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const alert = $('va-alert[status="error"]', container);
    expect(alert).to.exist;
    expect(alert.innerHTML).to.contain('your Social Security number.');
    expect($('.schemaform-sip-alert', container)).to.not.exist;
    expect($('.vads-c-action-link--green', container)).to.not.exist;
  });

  it('should render missing DOB alert', () => {
    const { props, mockStore } = getData({ dob: '' });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const alert = $('va-alert[status="error"]', container);
    expect(alert).to.exist;
    expect(alert.innerHTML).to.contain('your date of birth.');
    expect($('.schemaform-sip-alert', container)).to.not.exist;
    expect($('.vads-c-action-link--green', container)).to.not.exist;
  });

  it('should render missing SSN and DOB alert', () => {
    const { props, mockStore } = getData({ dob: '', canAppeal: '' });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const alert = $('va-alert[status="error"]', container);
    expect(alert).to.exist;
    expect(alert.innerHTML).to.contain(
      'your Social Security number and date of birth.',
    );
    expect($('.schemaform-sip-alert', container)).to.not.exist;
    expect($('.sip-wrapper', container)).to.not.exist;
  });

  it('should render top SIP alert with action links', () => {
    const { props, mockStore } = getData();
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($$('.vads-c-action-link--green', container).length).to.eq(2);
    expect($$('va-alert[status="info"]', container)[0].textContent).to.contain(
      'come back later to finish filling it out',
    );
    // Lower SiP alert not shown
    expect($('.sip-wrapper va-alert[status="info"]', container)).to.not.exist;
    expect($('va-alert[status="warning"]', container)).to.not.exist;
  });
});
