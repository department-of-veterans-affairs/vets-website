import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import FEATURE_FLAGS from 'platform/utilities/feature-toggles/featureFlagNames';
import {
  createPageList,
  createFormPageList,
} from 'platform/forms-system/src/js/helpers';
import formConfig from '../../../config/form';
import IntroductionLogin from '../../../components/IntroductionLogin';

const defaultState = {
  form: {
    formId: formConfig.formId,
    loadedData: {
      metadata: {},
    },
  },
  user: {
    login: {
      currentlyLoggedIn: false,
    },
    profile: {
      loa: { current: 1 },
    },
  },
  data: {},
  featureToggles: {},
};

const createMockStore = state => ({
  getState: () => state,
  subscribe: () => {},
  dispatch: sinon.stub(),
});

const formPages = createFormPageList(formConfig);
const pageList = createPageList(formConfig, formPages);

const defaultRoute = {
  pageList,
  formConfig,
};

const renderIntroductionLogin = store => {
  return render(
    <Provider store={store}>
      <IntroductionLogin route={defaultRoute} />
    </Provider>,
  );
};

describe('<IntroductionLogin />', () => {
  it('should render with default state', () => {
    const store = createMockStore(defaultState);

    const { container } = renderIntroductionLogin(store);

    expect(container).to.exist;
  });

  it('should render maintenance alert with general maintenance message', () => {
    const state = {
      ...defaultState,
      featureToggles: {
        ...defaultState.featureToggles,
        [FEATURE_FLAGS.showMeb1990EMaintenanceAlert]: true,
      },
    };

    const store = createMockStore(state);

    const { getByText } = renderIntroductionLogin(store);

    expect(
      getByText(
        'We’re currently making updates to the My Education Benefits platform. We apologize for the inconvenience. Please check back soon.',
      ),
    ).to.exist;
  });

  it('should render maintenance alert with R6 maintenance period message', () => {
    const state = {
      ...defaultState,
      featureToggles: {
        ...defaultState.featureToggles,
        [FEATURE_FLAGS.showMeb1990EMaintenanceAlert]: true,
        [FEATURE_FLAGS.showMeb1990ER6MaintenanceMessage]: true,
      },
    };

    const store = createMockStore(state);

    const { getByText } = renderIntroductionLogin(store);

    expect(
      getByText(
        'We are currently performing system updates. Please come back after 6:00 a.m. ET on Monday, July 28 when the application will be back up and running. Thank you for your patience while we continue improving our systems to provide faster, more convenient service to GI Bill beneficiaries.',
      ),
    ).to.exist;
  });

  it('should render va-alert-sign-in with signInOptional variant as default', () => {
    const state = {
      ...defaultState,
      user: {
        ...defaultState.user,
        login: {
          hasCheckedKeepAlive: true,
        },
      },
    };

    const store = createMockStore(state);

    const { container } = renderIntroductionLogin(store);

    expect(
      container.querySelector('va-alert-sign-in[variant="signInOptional"]'),
    ).to.exist;
  });

  it('should render va-alert-sign-in with signInRequired variant when meb1995Reroute is true', () => {
    const state = {
      ...defaultState,
      user: {
        ...defaultState.user,
        login: {
          hasCheckedKeepAlive: true,
        },
      },
      featureToggles: {
        ...defaultState.featureToggles,
        [FEATURE_FLAGS.meb1995Reroute]: true,
      },
    };

    const store = createMockStore(state);

    const { container } = renderIntroductionLogin(store);

    expect(
      container.querySelector('va-alert-sign-in[variant="signInRequired"]'),
    ).to.exist;
  });

  it('should handle openLoginModal via va-alert-sign-in', async () => {
    const state = {
      ...defaultState,
      user: {
        ...defaultState.user,
        login: {
          hasCheckedKeepAlive: true,
        },
      },
      featureToggles: {
        ...defaultState.featureToggles,
        [FEATURE_FLAGS.meb1995Reroute]: true,
      },
    };

    const store = createMockStore(state);

    const { container } = renderIntroductionLogin(store);
    const signInButton = container.querySelector(
      'va-button[text="Sign in or create an account"]',
    );
    fireEvent.click(signInButton);

    await waitFor(() => {
      const { dispatch } = store;
      expect(dispatch.calledWithMatch(toggleLoginModal(true))).to.be.true;
    });
  });

  it('should render <SaveInProgressIntro /> when maintenanceAlert is hidden for a user that is LOA3 and logged on with apiCallsComplete', () => {
    const state = {
      ...defaultState,
      user: {
        ...defaultState.user,
        login: {
          currentlyLoggedIn: true,
        },
        profile: {
          savedForms: [],
          prefillsAvailable: [],
          loa: { current: 3 },
        },
      },
      data: {
        personalInfoFetchComplete: true,
      },
    };

    const store = createMockStore(state);

    const { getByText } = renderIntroductionLogin(store);

    expect(
      getByText(
        'You can save this application in progress, and come back later to finish filling it out.',
      ),
    ).to.exist;
  });
});
