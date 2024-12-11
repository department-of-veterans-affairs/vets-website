import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import formConfig from '../../config/form';
import IntroductionPage from '../../containers/IntroductionPage';
import { MDOT_ERROR_CODES } from '../../constants';

const props = {
  route: {
    path: 'introduction',
    pageList: [],
    formConfig,
  },
  // userLoggedIn: false,
  userIdVerified: true,
};

const mockStore = {
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: true,
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
  it('renders', () => {
    const { container, getByRole } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container).to.exist;
    getByRole('link', { name: 'Start a new order' });
  });

  xit('suppresses the "Start order" link when alerts are present', () => {
    mockStore.getState = () => ({
      mdotInProgressForm: {
        error: {
          code: MDOT_ERROR_CODES.DECEASED,
        },
      },
    });
    const { findByRole } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    findByRole('link', { name: 'Start a new order' });
  });
});
