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
  coeStatus = '',
} = {}) => ({
  props: {
    loggedIn,
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

  it('should show denied logged in content', () => {
    const { props, mockStore } = getData({
      loggedIn: true,
      status: CALLSTATUS.success,
      coeStatus: COE_ELIGIBILITY_STATUS.denied,
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
