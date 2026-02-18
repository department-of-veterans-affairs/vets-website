/**
 * @module tests/containers/introduction-page.unit.spec
 * @description Unit tests for IntroductionPage component
 */

import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import {
  formConfig,
  IntroductionPage,
} from '@bio-aquia/21-2680-house-bound-status';

const props = {
  route: {
    path: 'introduction',
    pageList: [],
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
        dob: '1957-03-25',
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

  it('should show Start button when user is logged in and verified', () => {
    const loggedInVerifiedStore = {
      ...mockStore,
      getState: () => ({
        ...mockStore.getState(),
        user: {
          ...mockStore.getState().user,
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            ...mockStore.getState().user.profile,
            verified: true,
            loa: {
              current: 3,
              highest: 3,
            },
          },
        },
      }),
    };

    const { getByText } = render(
      <Provider store={loggedInVerifiedStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const startButton = getByText('Start your application');
    expect(startButton).to.exist;
  });

  it('should show IdNotVerifiedAlert when user is logged in but not verified', () => {
    const loggedInNotVerifiedStore = {
      ...mockStore,
      getState: () => ({
        ...mockStore.getState(),
        user: {
          ...mockStore.getState().user,
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            ...mockStore.getState().user.profile,
            verified: false,
            loa: {
              current: 1,
              highest: 1,
            },
          },
        },
      }),
    };

    const { getByTestId } = render(
      <Provider store={loggedInNotVerifiedStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );

    const verifyIdAlert = getByTestId('verifyIdAlert');
    expect(verifyIdAlert).to.exist;
  });
});
