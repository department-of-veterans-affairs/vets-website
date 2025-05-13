import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { setupServer } from 'msw/node';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import {
  createGetHandler,
  jsonResponse,
} from 'platform/testing/unit/msw-adapter';
import IntroductionPage from '../../containers/IntroductionPage';

const generateStore = ({
  hasVaFileNumber,
  isLoading = false,
  spyFn = () => {},
}) => ({
  getState: () => ({
    vaFileNumber: {
      isLoading,
      hasVaFileNumber: { ...hasVaFileNumber },
    },
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        savedForms: [],
        prefillsAvailable: [],
      },
    },
    form: {
      formId: '686C-674-V2',
      savedStatus: '',
      loadedData: {
        metadata: {},
      },
      data: {},
      contestedIssues: {},
    },
  }),
  subscribe: () => {},
  dispatch: spyFn,
});

const mockRoute = {
  pageList: [
    {
      path: 'wrong-path',
    },
    {
      path: 'testing',
    },
  ],
  formConfig: {
    prefillEnabled: false,
    downtime: false,
  },
};

describe('IntroductionPage', () => {
  const server = setupServer();
  before(() => {
    server.listen();
  });
  beforeEach(() => {
    server.resetHandlers();
  });
  after(() => {
    server.close();
  });
  it('renders the IntroductionPage component', () => {
    localStorage.setItem('hasSession', true);
    const store = generateStore({
      hasVaFileNumber: { VALIDVAFILENUMBER: true },
    });

    server.use(
      createGetHandler(
        `https://dev-api.va.gov/v0/profile/valid_va_file_number`,
        () => {
          return jsonResponse(
            {
              data: {
                attributes: {
                  // eslint-disable-next-line camelcase
                  valid_va_file_number: true,
                },
              },
            },
            { status: 200 },
          );
        },
      ),
    );

    const screen = render(
      <Provider store={store}>
        <IntroductionPage
          route={mockRoute}
          location={{ basename: '/some-path' }}
        />
      </Provider>,
    );

    expect(screen.queryByText('Add or remove dependents on VA benefits')).to
      .exist;
    expect(screen.queryByText('Follow these steps to get started')).to.exist;
  });
  it('renders the IntroductionPage component', () => {
    localStorage.setItem('hasSession', true);
    const store = generateStore({
      hasVaFileNumber: { errors: 'va file num error' },
    });
    server.use(
      createGetHandler(
        `https://dev-api.va.gov/v0/profile/valid_va_file_number`,
        () => {
          return jsonResponse(
            {
              errors: 'junk',
            },
            { status: 401 },
          );
        },
      ),
    );

    const screen = render(
      <Provider store={store}>
        <IntroductionPage
          route={mockRoute}
          location={{ basename: '/some-path' }}
        />
      </Provider>,
    );

    expect(screen.queryByText('We’re sorry. Something went wrong on our end'))
      .to.exist;
  });
  it('renders the IntroductionPage component', () => {
    localStorage.setItem('hasSession', true);
    const store = generateStore({
      isLoading: true,
    });

    const screen = render(
      <Provider store={store}>
        <IntroductionPage
          route={mockRoute}
          location={{ basename: '/some-path' }}
        />
      </Provider>,
    );

    const loadingIndicator = $('va-loading-indicator', screen.container);

    expect(loadingIndicator).to.not.be.null;
  });
  it('renders the IntroductionPage component', () => {
    localStorage.setItem('hasSession', true);
    const store = generateStore({
      isLoading: false,
      hasVaFileNumber: false,
    });

    const screen = render(
      <Provider store={store}>
        <IntroductionPage
          route={mockRoute}
          location={{ basename: '/some-path' }}
        />
      </Provider>,
    );

    const loadingIndicator = $('va-loading-indicator', screen.container);

    expect(loadingIndicator).to.be.null;
  });
});
