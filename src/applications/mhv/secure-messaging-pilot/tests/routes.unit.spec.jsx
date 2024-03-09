import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../secure-messaging/reducers';
import routes from '../routes';

describe('MHV Secure Messaging Pilot environment routes', () => {
  let oldLocation;

  beforeEach(() => {
    oldLocation = global.window.location;
    delete global.window.location;
    global.window.location = {
      replace: sinon.spy(),
    };
  });

  afterEach(() => {
    global.window.location = oldLocation;
  });
  const noDowntime = {
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get() {} },
      dismissedDowntimeWarnings: [],
    },
  };
  const initialState = {
    featureToggles: [],
    user: {
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        services: [backendServices.MESSAGING],
      },
    },
    ...noDowntime,
  };

  it('should redirect to the SM info page if the user is not whitelisted or the feature flag is disabled', () => {
    const customState = { ...initialState };
    customState.featureToggles[
      `${'mhv_secure_messaging_cerner_pilot'}`
    ] = false;
    customState.featureToggles[
      `${'mhv_secure_messaging_to_va_gov_release'}`
    ] = true;
    const { queryByText } = renderWithStoreAndRouter(routes, {
      initialState: customState,
      reducers: reducer,
      path: `/`,
    });

    expect(queryByText('Messages', { selector: 'h1', exact: true }));
    expect(window.location.replace.calledOnce).to.be.true;
  });

  it('should NOT redirect to the SM info page if the user is whitelisted or the feature flag is enabled', () => {
    const customState = { ...initialState };
    customState.featureToggles[`${'mhv_secure_messaging_cerner_pilot'}`] = true;
    customState.featureToggles[
      `${'mhv_secure_messaging_to_va_gov_release'}`
    ] = true;
    const { queryByText } = renderWithStoreAndRouter(routes, {
      initialState: customState,
      reducers: reducer,
      path: `/`,
    });

    expect(queryByText('Messages', { selector: 'h1', exact: true }));
    expect(window.location.replace.calledOnce).to.be.false;
  });
});
