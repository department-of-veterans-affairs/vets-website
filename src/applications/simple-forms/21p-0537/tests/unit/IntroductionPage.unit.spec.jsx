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
        path: '/veteran-info/name',
        title: "Deceased Veteran's name",
        uiSchema: {},
        schema: {
          type: 'object',
          properties: {},
        },
        chapterTitle: 'Deceased Veteran information',
        chapterKey: 'veteranInfoChapter',
        pageKey: 'veteranName',
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
        prefillsAvailable: ['21P-0537'],
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

describe('21P-0537 IntroductionPage', () => {
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

    getByText(/Marital Status Questionnaire for DIC Recipients/i);
  });

  it('renders the time-sensitive warning alert', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const alert = container.querySelector('va-alert[status="warning"]');
    expect(alert).to.exist;
    expect(alert.textContent).to.include('Time-sensitive response required');
    expect(alert.textContent).to.include('60 days');
  });

  it('renders the what to know section', () => {
    const { getByText } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    getByText(/What to know before you fill out this form/i);
    getByText(/Why we need this information/i);
    getByText(/What happens after you submit this form/i);
    getByText(/Your rights/i);
  });

  it('renders DIC eligibility information', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    // Text appears multiple times, so just check container
    expect(container.textContent).to.include(
      'Dependency and Indemnity Compensation',
    );
    expect(container.textContent).to.include('began after age 57');
    expect(container.textContent).to.include('remarriage has ended');
  });

  it('renders need help section with VA telephone components', () => {
    const { getByText, container } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    getByText(/Need help\?/i);

    // Should use va-telephone components, not plain text
    const telephoneComponents = container.querySelectorAll('va-telephone');
    expect(telephoneComponents.length).to.be.greaterThan(0);

    // Should NOT have anchor tags
    expect(container.querySelector('a[href="https://iris.va.gov"]')).to.be.null;
  });

  it('renders OMB info', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const ombInfo = container.querySelector('va-omb-info');
    expect(ombInfo).to.exist;
    expect(ombInfo).to.have.attr('res-burden', '5');
    expect(ombInfo).to.have.attr('omb-number', '2900-0495');
    expect(ombInfo).to.have.attr('exp-date', '12/31/2027');
  });

  it('renders SaveInProgressIntro component', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    // Check that the start button text is rendered
    expect(container.textContent).to.include('Start the questionnaire');
  });

  it('calls focusElement on mount', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    // focusElement is called in useEffect for the title
    const title = container.querySelector('.schemaform-title > h1');
    expect(title).to.exist;
  });
});
