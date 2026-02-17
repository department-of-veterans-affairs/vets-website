import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import formConfig from '../../config/form';
import IntroductionPage from '../../containers/IntroductionPage';

const props = {
  route: {
    path: 'introduction',
    pageList: [
      { path: '/introduction', title: 'Introduction' },
      { path: '/first-page', title: 'First Page' },
    ],
    formConfig,
  },
  userLoggedIn: false,
  userIdVerified: true,
};

const mockStore = {
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: false,
      },
      profile: {
        savedForms: [],
        prefillsAvailable: [],
        loa: {
          current: 3,
          highest: 3,
        },
        verified: true,
        dob: '2000-01-01',
        claims: {
          appeals: false,
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
};

describe('IntroductionPage', () => {
  it('should render', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });
  it('should render sigin alert when user is not logged in', () => {
    const loggedInProps = {
      ...props,
      loggedIn: false,
      showLoadingIndicator: false,
    };
    const { getByTestId } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...loggedInProps} />
      </Provider>,
    );
    expect(getByTestId('sign-in-alert')).to.exist;
  });
  it('should not render sign-in alert when user is logged in', () => {
    const mockStoreWithLoggedOutUser = {
      ...mockStore,
      getState: () => ({
        ...mockStore.getState(),
        user: {
          ...mockStore.getState().user,
          login: {
            currentlyLoggedIn: true,
          },
        },
      }),
    };
    const loggedInProps = {
      ...props,
      loggedIn: true,
    };
    const { queryByTestId, getByText } = render(
      <Provider store={mockStoreWithLoggedOutUser}>
        <IntroductionPage {...loggedInProps} />
      </Provider>,
    );
    expect(queryByTestId('sign-in-alert')).to.not.exist;
    expect(getByText('Start your Application for the High Technology Program'))
      .to.exist;
  });
});
