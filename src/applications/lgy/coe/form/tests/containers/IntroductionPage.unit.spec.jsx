import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { BrowserRouter } from 'react-router-dom';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import { CALLSTATUS, COE_ELIGIBILITY_STATUS } from '../../../shared/constants';
import IntroductionPage from '../../containers/IntroductionPage';

const getData = ({
  loggedIn = true,
  status = CALLSTATUS.skip,
  isVerified = false,
  canApply = false,
  coeStatus = '',
} = {}) => ({
  props: {
    loggedIn,
    isVerified,
    canApply,
    route: {
      formConfig,
      pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
    },
    location: {
      basename: '/foo',
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
          claims: { coe: canApply },
          signIn: { serviceName: 'idme' },
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
      certificateOfEligibility: {
        coe: {
          status: coeStatus,
          referenceNumber: 'x123456x',
          applicationCreateDate: Date.now(),
        },
        generateAutoCoeStatus: status,
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('IntroductionPage', () => {
  it('should render', () => {
    const { props, mockStore } = getData({ status: '' });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect($('va-loading-indicator', container)).to.exist;
  });

  it('should show not logged in content', () => {
    const { props, mockStore } = getData({
      loggedIn: false,
      status: CALLSTATUS.skip,
      isVerified: false,
      canApply: false,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />,
      </Provider>,
    );
    expect($('h2', container).textContent).to.contain(
      'Sign in to request a COE',
    );
  });

  it('prompts the vet to verify their account if they are still at loa1', () => {
    const { props, mockStore } = getData({
      loggedIn: true,
      status: CALLSTATUS.skip,
      isVerified: false,
      canApply: false,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />,
      </Provider>,
    );
    const signInAlert = $('va-alert-sign-in', container);
    expect(signInAlert).to.exist;
    expect(signInAlert.getAttribute('variant')).to.eql('verifyIdMe');
    expect(signInAlert.getAttribute('heading-level')).to.eql('2');
  });

  it('prompts the vet to inquire about their EDIPI if they are missing one', () => {
    const { props, mockStore } = getData({
      loggedIn: true,
      status: CALLSTATUS.skip,
      isVerified: true,
      canApply: false,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />,
      </Provider>,
    );
    expect($('h2', container).textContent).to.contain(
      'We need more information for your application',
    );
  });

  it('should show denied logged in content', () => {
    const { props, mockStore } = getData({
      loggedIn: true,
      status: CALLSTATUS.success,
      coeStatus: COE_ELIGIBILITY_STATUS.denied,
      isVerified: true,
      canApply: true,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />,
      </Provider>,
      { wrapper: BrowserRouter },
    );

    expect($('h2', container).textContent).to.contain(
      'We denied your request for a COE', // va-alert Denied status
    );
  });

  it('should show available logged in content', () => {
    const { props, mockStore } = getData({
      loggedIn: true,
      status: CALLSTATUS.success,
      coeStatus: COE_ELIGIBILITY_STATUS.available,
      isVerified: true,
      canApply: true,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />,
      </Provider>,
      { wrapper: BrowserRouter },
    );

    expect($('h2', container).textContent).to.contain(
      'You already have a COE', // va-alert Available status
    );
    expect($('va-process-list')).to.exist;
  });
});
