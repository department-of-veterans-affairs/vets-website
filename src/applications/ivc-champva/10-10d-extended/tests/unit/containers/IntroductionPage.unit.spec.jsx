import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import formConfig from '../../../config/form';
import IntroductionPage from '../../../containers/IntroductionPage';

describe('1010d IntroductionPage', () => {
  const subject = ({ loggedIn = true } = {}) => {
    const props = {
      route: {
        formConfig,
        pageList: [{ path: '/introduction' }, { path: '/next', formConfig }],
      },
    };
    const mockStore = {
      getState: () => ({
        form: {
          formId: formConfig.formId,
          data: {},
          migrations: [],
          loadedData: { metadata: {} },
          lastSavedDate: null,
          prefillTransformer: null,
        },
        user: {
          login: {
            currentlyLoggedIn: loggedIn,
          },
          profile: {
            loading: false,
            loa: { current: loggedIn ? 3 : undefined },
            savedForms: [],
            prefillsAvailable: [],
          },
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
      dispatch: () => {},
    };
    const { container } = render(
      <Provider store={mockStore}>
        <IntroductionPage {...props} />
      </Provider>,
    );
    const selectors = () => ({
      signInAlert: container.querySelector(
        'va-alert-sign-in[variant="signInOptionalNoPrefill"]',
      ),
      startBtn: container.querySelector('a[href="#start"]'),
    });
    return { selectors };
  };

  it('should render start button when the user is logged in', () => {
    const { selectors } = subject();
    expect(selectors().startBtn).to.exist;
  });

  it('should render login alert when the user is logged out', () => {
    const { selectors } = subject({ loggedIn: false });
    expect(selectors().signInAlert).to.exist;
  });
});
