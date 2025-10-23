import React from 'react';
import { Provider } from 'react-redux';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import formConfig from '../../config/form';
import IntroductionPage from '../../containers/IntroductionPage';

const props = {
  route: {
    path: 'introduction',
    pageList: [
      {
        pageKey: 'introduction',
        path: '/introduction',
      },
      {
        path: '/veteran-name',
        title: "Veteran's name",
        uiSchema: {},
        schema: {
          type: 'object',
          properties: {},
        },
        chapterTitle: 'Veteran information',
        chapterKey: 'veteranInformationChapter',
        pageKey: 'veteranFullName',
      },
      {
        pageKey: 'review-and-submit',
        path: '/review-and-submit',
        chapterKey: 'review',
      },
    ],
    formConfig,
  },
};

const loggedInUser = {
  currentlyLoggedIn: true,
};

const mockStore = (loggedIn = true, dispatchSpy = sinon.spy()) => ({
  getState: () => ({
    user: {
      login: loggedIn ? loggedInUser : { currentlyLoggedIn: false },
      profile: {
        savedForms: [],
        prefillsAvailable: ['21P-601'],
        userFullName: {
          first: 'Jane',
          last: 'Doe',
        },
        email: 'jane.doe@example.com',
        phoneNumber: '5551234567',
        loa: {
          current: 3,
        },
        verified: true,
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
      serviceMap: { get: () => {} },
      dismissedDowntimeWarnings: [],
    },
  }),
  subscribe: () => {},
  dispatch: dispatchSpy,
});

describe('21P-601 IntroductionPage', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders successfully for logged in user', () => {
    const { container } = render(
      <Provider store={mockStore(true)}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });

  it('renders successfully for logged out user', () => {
    const { container } = render(
      <Provider store={mockStore(false)}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });

  it('renders the correct title', () => {
    const { getByText } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    getByText(/Apply for accrued benefits for a deceased beneficiary/i);
  });

  it('renders the form subtitle', () => {
    const { getByText } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    getByText(
      /Application for Accrued Amounts Due a Deceased Beneficiary \(VA Form 21P-601\)/i,
    );
  });

  it('renders accrued benefits information', () => {
    const { getByText } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    getByText(/What are accrued benefits\?/i);
    getByText(/Accrued benefits are VA benefits that were due/i);
  });

  it('renders alert about already filed for survivor benefits', () => {
    const { getByText } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    getByText(/Already filed for survivor benefits\?/i);
    getByText(/Do NOT complete this form if you have already applied/i);
  });

  it('renders who can use this form section', () => {
    const { getByText } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    getByText(/Who can use this form\?/i);
    getByText(/The surviving spouse of a deceased veteran or beneficiary/i);
    getByText(/A child of a deceased veteran or beneficiary/i);
    getByText(/A dependent parent of a deceased veteran/i);
  });

  it('renders time limit warning alert', () => {
    const { getByText } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    getByText(/Time limit to apply/i);
    getByText(/You must file this application within/i);
    getByText(/one year/i);
  });

  it('renders what you will need section', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    expect(container.textContent).to.include('Date of death');
  });

  it('renders OMB info with correct values', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const ombInfo = container.querySelector('va-omb-info');
    expect(ombInfo).to.exist;
    expect(ombInfo).to.have.attr('res-burden', '30');
    expect(ombInfo).to.have.attr('omb-number', '2900-0016');
    expect(ombInfo).to.have.attr('exp-date', '8/31/2026');
  });

  it('displays non-veteran messaging', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    expect(container.textContent).to.include('Apply for accrued benefits');
  });

  it('renders SaveInProgressIntro component with start button', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    expect(container.textContent).to.include('Start the application');
  });
});
