import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import formConfig from '../../../config/form';
import IntroductionPage from '../../../containers/IntroductionPage';

const props = {
  route: {
    path: 'introduction',
    pageList: [],
    formConfig,
  },
  userLoggedIn: false,
  userIdVerified: true,
};

function getMockStore(showVerifyIdentify = false) {
  return {
    getState: () => ({
      user: {
        login: {
          currentlyLoggedIn: showVerifyIdentify,
        },
        profile: {
          savedForms: [],
          prefillsAvailable: [],
          loa: {
            current: showVerifyIdentify ? null : 3,
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
}

describe('IntroductionPage', () => {
  it('should render', () => {
    const store = getMockStore();
    const { container } = render(
      <Provider store={store}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container.querySelector('va-alert-sign-in')).to.exist;
  });

  it('should render sign in if not logged in', () => {
    const store = getMockStore(true);
    const { container } = render(
      <Provider store={store}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container.querySelector('va-alert-sign-in')).not.to.exist;
  });
});
