import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import formConfig from '../../../config/form';
import IntroductionPage from '../../../containers/IntroductionPage';

describe('10-7959f-2 IntroductionPage', () => {
  const subject = ({ loaState = 3, loggedIn = true } = {}) => {
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
          loadedData: { metadata: {} },
          lastSavedDate: null,
          migrations: [],
          prefillTransformer: null,
        },
        user: {
          login: {
            currentlyLoggedIn: loggedIn,
          },
          profile: {
            loading: false,
            loa: { current: loaState },
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
      identityAlert: container.querySelector(
        'va-alert-sign-in[variant="verifyIdMe"]',
      ),
      signInAlert: container.querySelector(
        'va-alert-sign-in[variant="signInRequired"]',
      ),
      startBtn: container.querySelector('a[href="#start"]'),
    });
    return { selectors };
  };

  it('should render identity verification alert when the user is LOA1 status', () => {
    const { selectors } = subject({ loaState: 1 });
    expect(selectors().identityAlert).to.exist;
  });

  it('should render start button when the user is LOA3 status', () => {
    const { selectors } = subject();
    expect(selectors().startBtn).to.exist;
  });

  it('should render login alert when the user is logged out', () => {
    const { selectors } = subject({ loggedIn: false, loaState: null });
    expect(selectors().signInAlert).to.exist;
  });
});
