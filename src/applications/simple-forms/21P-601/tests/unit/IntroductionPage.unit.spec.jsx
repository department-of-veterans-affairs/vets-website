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
      data: { isLoggedIn: false },
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

    getByText(/Apply for accrued benefits online/i);
  });

  it('renders the form subtitle', () => {
    const { getByText } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    getByText(
      /Primarily for anyone applying for accrued benefits only, to include executors or administrators of VA beneficiaries’ estates \(VA Form 21P-601\)/i,
    );
  });

  it('renders accrued benefits information', () => {
    const { getByText } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    getByText(/What to know before you fill out this application/i);
    getByText(/Who should use this form/i);
  });

  it('renders alert about already filed for survivor benefits', () => {
    const { getByText } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    getByText(/If you already submitted an application for VA DIC/i);
  });

  it('renders who can use this form section', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    expect(container.textContent).to.include('Who should use this form');
    expect(container.textContent).to.include('executor or administrator');
    expect(container.textContent).to.include('surviving spouse');
  });

  it('renders time limit warning alert', () => {
    const { getByText } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    getByText(/Time limits to apply/i);
    getByText(/You must apply for accrued benefits within/i);
    getByText(/1 year/i);
  });

  it('renders what you will need section', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    expect(container.textContent).to.include('What you');
    expect(container.textContent).to.include('need to apply');
    expect(container.textContent).to.include('date of death');
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
    expect(ombInfo).to.have.attr('omb-number', '2900-0216');
    expect(ombInfo).to.have.attr('exp-date', '9/30/2028');
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

    expect(container.textContent).to.include('Apply for accrued benefits');
  });
});
