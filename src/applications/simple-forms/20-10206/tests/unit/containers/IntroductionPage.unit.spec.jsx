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
};

const generateStore = ({ loggedIn = false, loaCurrent = 3 } = {}) => ({
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: loggedIn,
      },
      profile: {
        savedForms: [],
        prefillsAvailable: [],
        verified: false,
        dob: '2000-01-01',
        loa: {
          current: loaCurrent,
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
});

describe('IntroductionPage', () => {
  it('should render', () => {
    const mockStore = generateStore();
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    expect(container).to.exist;
  });
  it('should render the va-alert-sign-in for LOA1 users', () => {
    const mockStore = generateStore({ loggedIn: true, loaCurrent: 1 });
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage route={props.route} />
      </Provider>,
    );
    expect(container.querySelector('va-alert-sign-in')).to.exist;
  });
});
