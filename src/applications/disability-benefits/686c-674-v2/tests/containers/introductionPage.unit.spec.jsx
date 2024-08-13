import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import IntroductionPage from '../../containers/IntroductionPage';

const store = {
  getState: () => ({
    vaFileNumber: {
      hasVaFileNumber: {
        VALIDVAFILENUMBER: true,
      },
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
  dispatch: () => {},
};

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
  it('renders the IntroductionPage component', () => {
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
});
