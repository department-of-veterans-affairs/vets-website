import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { TITLE, SUBTITLE } from '../../../config/constants';
import formConfig from '../../../config/form';
import IntroductionPage from '../../../containers/IntroductionPage';

const props = {
  route: {
    path: 'introduction',
    pageList: [
      {
        pageKey: 'introduction',
        path: '/introduction',
      },
      {
        path: '/first-page',
        title: 'First Page',
        uiSchema: {},
        schema: {
          type: 'object',
          properties: {
            firstField: {
              type: 'string',
            },
          },
        },
        chapterTitle: 'Chapter 1',
        chapterKey: 'chapter1',
        pageKey: 'page1',
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

const generateStore = ({ loggedIn = false, loaCurrent = 3 } = {}) => ({
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: loggedIn,
      },
      profile: {
        savedForms: [],
        prefillsAvailable: ['21-4138'],
        dob: '2000-01-01',
        loa: {
          current: loaCurrent,
        },
        verified: loaCurrent === 3,
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
});

describe('IntroductionPage', () => {
  it('renders successfully', () => {
    const mockStore = generateStore();
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });

  it('renders the correct title and subtitle', () => {
    const mockStore = generateStore();
    const { getByText } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(getByText(TITLE)).to.exist;
    expect(getByText(SUBTITLE)).to.exist;
  });

  it('renders <LOA3 content if user is logged in and not id-verified', () => {
    const mockStore = generateStore({ loggedIn: true, loaCurrent: 1 });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const sipAlert = container.querySelector('va-alert[status=info]');
    expect(sipAlert).to.not.exist;
  });

  it('renders LOA3 content if user is logged-in and id-verified', () => {
    const mockStore = generateStore({ loggedIn: true });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const userNotVerifiedDiv = container.querySelector(
      '[data-testid=verifyIdAlert]',
    );
    const sipAlert = container.querySelector('va-alert[status=info]');
    expect(userNotVerifiedDiv).to.not.exist;
    expect(sipAlert).to.exist;
  });
});
