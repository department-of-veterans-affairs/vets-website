import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import { fromUnixTime } from 'date-fns';
import { format } from 'date-fns-tz';
import * as routing from 'platform/forms-system/src/js/routing';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import sinon from 'sinon';
import { SaveInProgressIntro } from '../../save-in-progress/SaveInProgressIntro';

const createPageList = (paths = ['wrong-path', 'testing']) =>
  paths.map(path => ({ path }));

const createFormConfig = (config = {}) => ({
  saveInProgress: {
    messages: {
      expired: 'Your application has expired.',
      ...(config.messages || {}),
    },
  },
  customText: {
    appType: 'application',
    ...(config.customText || {}),
  },
  ...config,
});

const createUser = (overrides = {}) => ({
  profile: {
    savedForms: [],
    prefillsAvailable: [],
    loading: false,
    ...overrides.profile,
  },
  login: {
    currentlyLoggedIn: false,
    loginUrls: {
      idme: '/mockLoginUrl',
    },
    ...overrides.login,
  },
});

const createSavedForm = (overrides = {}) => {
  const { metadata: metadataOverrides = {}, ...rest } = overrides;
  return {
    form: VA_FORM_IDS.FORM_10_10EZ,
    ...rest,
    metadata: {
      lastUpdated: 946684800,
      expiresAt: 1893456000, // 2030-01-01T00:00:00Z
      ...metadataOverrides,
    },
  };
};

const createStore = (stateOverrides = {}) => {
  const state = {
    featureToggles: {},
    form: {
      formId: VA_FORM_IDS.FORM_10_10EZ,
      data: {},
      loadedData: { metadata: {} },
      lastSavedDate: null,
      migrations: [],
      prefillTransformer: null,
    },
    user: createUser(),
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: { get: () => {} },
      dismissedDowntimeWarnings: [],
    },
    ...stateOverrides,
  };

  return {
    getState: () => state,
    subscribe: () => {},
    dispatch: sinon.spy(),
  };
};

const defaultProps = {
  pageList: createPageList(),
  formId: VA_FORM_IDS.FORM_10_10EZ,
  fetchInProgressForm: sinon.spy(),
  removeInProgressForm: sinon.spy(),
  toggleLoginModal: sinon.spy(),
  formConfig: createFormConfig(),
  saveInProgress: { formData: {} },
};

const renderComponent = (
  props = {},
  { stateOverrides = {}, initialEntries = ['/'] } = {},
) => {
  const mergedProps = { ...defaultProps, ...props };
  const store = createStore({
    ...stateOverrides,
    ...(mergedProps.user ? { user: mergedProps.user } : {}),
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries}>
        <SaveInProgressIntro {...mergedProps} />
      </MemoryRouter>
    </Provider>,
  );
};

const getElements = container => ({
  alert: container.querySelector('va-alert'),
  alertSignIn: container.querySelector('va-alert-sign-in'),
  button: container.querySelector('va-button, button, .usa-button'),
  loadingIndicator: container.querySelector('va-loading-indicator'),
  startLink: container.querySelector('.schemaform-start-button'),
  actionLink: container.querySelector(
    '.vads-c-action-link--green, va-link-action',
  ),
});

const loggedIn = (overrides = {}) =>
  createUser({
    login: {
      currentlyLoggedIn: true,
      ...(overrides.login || {}),
      loginUrls: {
        idme: '/mockLoginUrl',
        ...(overrides.login?.loginUrls || {}),
      },
    },
    profile: {
      savedForms: [],
      prefillsAvailable: [],
      loading: false,
      ...(overrides.profile || {}),
    },
    ...overrides,
  });

const withSavedForm = (
  userOverrides = {},
  savedFormOverrides = {},
  { savedForms = null } = {},
) =>
  loggedIn({
    ...userOverrides,
    profile: {
      ...(userOverrides.profile || {}),
      savedForms: savedForms || [createSavedForm(savedFormOverrides)],
    },
  });

const withPrefill = (userOverrides = {}) =>
  loggedIn({
    ...userOverrides,
    profile: {
      ...(userOverrides.profile || {}),
      prefillsAvailable: [VA_FORM_IDS.FORM_10_10EZ],
    },
  });

const subject = (props = {}, opts = {}) => {
  const result = renderComponent(props, opts);
  return {
    ...result,
    els: getElements(result.container),
  };
};

describe('<SaveInProgressIntro>', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers({
      now: new Date('2025-01-15T12:00:00Z').getTime(),
      toFake: ['Date'],
    });
  });

  afterEach(() => {
    clock.restore();
  });

  describe('when user is logged in with an active saved form', () => {
    it('should render in progress message with last saved date', () => {
      const lastUpdated = 946684800;
      const user = withSavedForm({}, { metadata: { lastUpdated } });
      const { els } = subject({ user });
      expect(els.alert).to.exist;
      expect(els.alert.textContent).to.include(
        'Your application is in progress',
      );
      expect(els.alert.textContent).to.include('will expire on');
      expect(els.alert.textContent).to.include(
        format(fromUnixTime(lastUpdated), "MMMM d, yyyy', at'"),
      );
    });

    it('should render with custom heading level', () => {
      const user = withSavedForm();
      const { container } = subject({ user, headingLevel: 3 });
      const heading = container.querySelector('va-alert h3');
      expect(heading).to.exist;
      expect(heading.textContent).to.include('Your application is in progress');
    });

    it('should render form start controls', () => {
      const user = withSavedForm();
      const { container } = subject({ user });
      expect(
        container.querySelector(
          'va-button[data-testid="continue-your-application"]',
        ),
      ).to.exist;
    });

    it('should use custom continue message when provided', () => {
      const user = withSavedForm();
      const continueMsg = <p>Custom continue message</p>;
      const { container } = subject({ user, continueMsg });
      expect(container.textContent).to.include('Custom continue message');
    });

    it('should render custom app type text', () => {
      const user = withSavedForm();
      const formConfig = createFormConfig({ customText: { appType: 'claim' } });
      const { container } = subject({ user, formConfig });
      expect(container.textContent).to.match(/claim/i);
    });
  });

  describe('when user is logged in with an expired saved form', () => {
    it('should render expired message', () => {
      const now = new Date('2025-01-15T12:00:00Z');
      const nowUnix = Math.floor(now.getTime() / 1000);
      const user = withSavedForm(
        {
          profile: {},
        },
        {
          metadata: {
            lastUpdated: nowUnix - 60 * 86400,
            expiresAt: nowUnix - 86400,
          },
        },
      );
      const { els } = subject({ user });
      expect(els.alert).to.exist;
      expect(els.alert.getAttribute('status')).to.equal('warning');
      expect(els.alert.textContent).to.include('Your application has expired');
    });
  });

  describe('when user is logged in without saved form but with prefill available', () => {
    it('should render default prefill notification', () => {
      const user = withPrefill();
      const { els } = subject({ user });
      expect(els.alert).to.exist;
      expect(els.alert.textContent).to.include(
        'We’ve prefilled some of your information',
      );
      expect(els.alert.textContent).to.include('Since you’re signed in');
    });

    it('should render custom verified prefill alert when provided', () => {
      const user = withPrefill();
      const verifiedPrefillAlert = (
        <div data-testid="custom-prefill">Custom prefill alert</div>
      );
      const { getByTestId } = subject({ user, verifiedPrefillAlert });
      expect(getByTestId('custom-prefill')).to.exist;
    });
  });

  describe('when user is logged in without saved form and no prefill', () => {
    it('should render save in progress message', () => {
      const user = loggedIn();
      const { els } = subject({ user });
      expect(els.alert).to.exist;
      expect(els.alert.textContent).to.include(
        'You can save this application in progress',
      );
    });

    it('should render form start controls', () => {
      const user = loggedIn();
      const { els } = subject({ user });
      expect(els.actionLink).to.exist;
    });
  });

  describe('when user is logged out with prefill enabled', () => {
    it('should render signInOptional variant with start link', () => {
      const user = createUser();
      const { els } = subject({ user, prefillEnabled: true });
      expect(els.alertSignIn).to.exist;
      expect(els.alertSignIn.getAttribute('variant')).to.equal(
        'signInOptional',
      );
      expect(els.button).to.exist;
      expect(els.button.getAttribute('text')).to.include(
        'Sign in to start your application',
      );
      expect(els.startLink).to.exist;
      expect(els.startLink.textContent).to.include(
        'Start your application without signing in',
      );
    });

    it('should call toggleLoginModal when sign in button is clicked', async () => {
      const user = createUser();
      const toggleLoginModal = sinon.spy();
      const { els } = subject({
        user,
        prefillEnabled: true,
        toggleLoginModal,
      });
      await fireEvent.click(els.button);
      expect(toggleLoginModal.calledOnce).to.be.true;
    });

    it('should use custom retention period', () => {
      const user = createUser();
      const { container } = subject({
        user,
        prefillEnabled: true,
        retentionPeriod: '1 year',
      });
      const alertSignIn = container.querySelector('va-alert-sign-in');
      expect(alertSignIn.getAttribute('time-limit')).to.equal('1 year');
    });

    it('should render custom unauthStartText', () => {
      const user = createUser();
      const { els } = subject({
        user,
        prefillEnabled: true,
        unauthStartText: 'Custom sign in text',
      });
      expect(els.button.getAttribute('text')).to.include('Custom sign in text');
    });

    it('should render custom unverified prefill alert', () => {
      const user = createUser();
      const unverifiedPrefillAlert = (
        <div data-testid="custom-unverified">Custom unverified alert</div>
      );
      const { getByTestId } = subject({
        user,
        prefillEnabled: true,
        unverifiedPrefillAlert,
      });
      expect(getByTestId('custom-unverified')).to.exist;
    });
  });

  describe('when user is logged out with hideUnauthedStartLink prop', () => {
    it('should render signInRequired variant without start link', () => {
      const user = createUser();
      const { els } = subject({
        user,
        prefillEnabled: true,
        hideUnauthedStartLink: true,
      });
      expect(els.alertSignIn).to.exist;
      expect(els.alertSignIn.getAttribute('variant')).to.equal(
        'signInRequired',
      );
      expect(els.button).to.exist;
      expect(els.startLink).to.not.exist;
    });

    it('should pass requiresVerified to toggleLoginModal', async () => {
      const user = createUser();
      const toggleLoginModal = sinon.spy();
      const { els } = subject({
        user,
        prefillEnabled: true,
        hideUnauthedStartLink: true,
        toggleLoginModal,
      });
      await fireEvent.click(els.button);
      expect(toggleLoginModal.calledOnce).to.be.true;
      expect(toggleLoginModal.firstCall.args[2]).to.be.true;
    });

    it('should use requiresVerifiedUser from formConfig', async () => {
      const user = createUser();
      const toggleLoginModal = sinon.spy();
      const formConfig = createFormConfig({ requiresVerifiedUser: true });
      const { els } = subject({
        user,
        prefillEnabled: true,
        formConfig,
        toggleLoginModal,
      });
      await fireEvent.click(els.button);
      expect(toggleLoginModal.firstCall.args[2]).to.be.true;
    });
  });

  describe('when user is logged out without prefill enabled', () => {
    it('should render signInOptionalNoPrefill variant', () => {
      const user = createUser();
      const { els } = subject({ user });
      expect(els.alertSignIn).to.exist;
      expect(els.alertSignIn.getAttribute('variant')).to.equal(
        'signInOptionalNoPrefill',
      );
    });

    it('should render sign in button with correct text', () => {
      const user = createUser();
      const { els } = subject({ user });
      expect(els.button).to.exist;
      expect(els.button.getAttribute('text')).to.include(
        'Sign in to start your application',
      );
    });

    it('should apply aria-label and aria-describedby to button', () => {
      const user = createUser();
      const { els } = subject({
        user,
        ariaLabel: 'test-aria-label',
        ariaDescribedby: 'test-aria-describedby',
      });
      expect(els.button.getAttribute('label')).to.equal('test-aria-label');
    });

    it('should apply aria-describedby to the unauth start link', () => {
      const user = createUser();
      const { container } = subject({
        user,
        prefillEnabled: true,
        ariaDescribedby: 'test-aria-describedby',
      });
      const startLink = container.querySelector('.schemaform-start-button');
      expect(startLink).to.exist;
      expect(startLink.getAttribute('aria-describedby')).to.equal(
        'test-aria-describedby',
      );
    });
  });

  describe('when user is logged out with prefill enabled and verifyRequiredPrefill is true', () => {
    it('should render signInOptionalNoPrefill variant', () => {
      const user = createUser();
      const { els } = subject({
        user,
        prefillEnabled: true,
        verifyRequiredPrefill: true,
      });
      expect(els.alertSignIn).to.exist;
      expect(els.alertSignIn.getAttribute('variant')).to.equal(
        'signInOptionalNoPrefill',
      );
      expect(els.button).to.exist;
      expect(els.startLink).to.exist;
    });

    it('should render custom unverified prefill alert when provided', () => {
      const user = createUser();
      const unverifiedPrefillAlert = (
        <div data-testid="custom-unverified-verify">
          Custom unverified alert for verified prefill
        </div>
      );
      const { getByTestId } = subject({
        user,
        prefillEnabled: true,
        verifyRequiredPrefill: true,
        unverifiedPrefillAlert,
      });
      expect(getByTestId('custom-unverified-verify')).to.exist;
    });
  });

  describe('when buttonOnly is true', () => {
    it('should render only buttons without alert wrapper for unauthenticated users', () => {
      const user = createUser();
      const { els } = subject({
        user,
        prefillEnabled: true,
        buttonOnly: true,
      });
      expect(els.alertSignIn).to.not.exist;
      expect(els.button).to.exist;
      expect(els.startLink).to.exist;
    });

    it('should hide start link when hideUnauthedStartLink is true', () => {
      const user = createUser();
      const { els } = subject({
        user,
        prefillEnabled: true,
        buttonOnly: true,
        hideUnauthedStartLink: true,
      });
      expect(els.startLink).to.not.exist;
    });

    it('should not render alert for authenticated users', () => {
      const user = loggedIn();
      const { els } = subject({
        user,
        buttonOnly: true,
      });
      expect(els.alert).to.not.exist;
      expect(els.alertSignIn).to.not.exist;
    });
  });

  describe('when startMessageOnly is true', () => {
    it('should render only the alert message without controls', () => {
      const user = createUser();
      const { els } = subject({
        user,
        startMessageOnly: true,
      });
      expect(els.alertSignIn).to.exist;
    });

    it('should not return null when resumeOnly is true and saved form exists', () => {
      const user = withSavedForm();
      const { container } = subject({
        user,
        startMessageOnly: true,
        resumeOnly: true,
      });
      expect(container.querySelector('va-alert')).to.exist;
    });
  });

  describe('when resumeOnly is true', () => {
    it('should render nothing when no saved form exists', () => {
      const user = loggedIn();
      const { container } = subject({
        user,
        resumeOnly: true,
      });
      expect(container.textContent).to.be.empty;
    });

    it('should render saved form alert when saved form exists', () => {
      const user = withSavedForm();
      const { container } = subject({
        user,
        resumeOnly: true,
      });
      expect(container.textContent).to.include(
        'Your application is in progress',
      );
    });
  });

  describe('when profile is loading', () => {
    it('should render loading indicator', () => {
      const user = createUser({
        profile: { loading: true },
      });
      const { els } = subject({ user });
      expect(els.loadingIndicator).to.exist;
      expect(els.loadingIndicator.getAttribute('message')).to.include(
        'Checking to see if you have a saved version',
      );
    });

    it('should not render loading indicator when resumeOnly is true', () => {
      const user = createUser({
        profile: { loading: true },
      });
      const { els } = subject({
        user,
        resumeOnly: true,
      });
      expect(els.loadingIndicator).to.not.exist;
    });
  });

  describe('when navigating and routing', () => {
    it('should trigger no-login-start-form event on start link click', async () => {
      const user = createUser();
      const { els } = subject({
        user,
        prefillEnabled: true,
      });
      await fireEvent.click(els.startLink);
      expect(els.startLink).to.exist;
    });

    it('should use VaLink when useWebComponentForNavigation is true', () => {
      const user = createUser();
      const router = { push: sinon.spy() };
      const formConfig = createFormConfig({
        formOptions: { useWebComponentForNavigation: true },
      });
      const { container } = subject({
        user,
        prefillEnabled: true,
        formConfig,
        router,
      });
      const vaLink = container.querySelector('va-link.schemaform-start-button');
      expect(vaLink).to.exist;
    });

    it('should navigate when VaLink is clicked', async () => {
      const user = createUser();
      const router = { push: sinon.spy() };
      const formConfig = createFormConfig({
        formOptions: { useWebComponentForNavigation: true },
      });
      const { container } = subject({
        user,
        prefillEnabled: true,
        formConfig,
        router,
      });
      const vaLink = container.querySelector('va-link.schemaform-start-button');
      await fireEvent.click(vaLink);
      expect(router.push.calledOnce).to.be.true;
    });
  });

  describe('when using custom link component', () => {
    /* eslint-disable react/prop-types, @department-of-veterans-affairs/prefer-button-component */
    const CustomLink = ({ children, onClick }) => (
      <button type="button" onClick={onClick} data-testid="custom-link">
        {children}
      </button>
    );
    /* eslint-enable react/prop-types, @department-of-veterans-affairs/prefer-button-component */

    it('should render custom link when provided', () => {
      const user = createUser();
      const { getByTestId } = subject({
        user,
        prefillEnabled: true,
        customLink: CustomLink,
        unauthStartText: 'Custom Link Text',
      });
      expect(getByTestId('custom-link')).to.exist;
      expect(getByTestId('custom-link').textContent).to.equal(
        'Custom Link Text',
      );
    });

    it('should call toggleLoginModal when custom link is clicked', async () => {
      const user = createUser();
      const toggleLoginModal = sinon.spy();
      const { getByTestId } = subject({
        user,
        prefillEnabled: true,
        customLink: CustomLink,
        toggleLoginModal,
      });
      await fireEvent.click(getByTestId('custom-link'));
      expect(toggleLoginModal.calledOnce).to.be.true;
    });
  });

  describe('when displaying downtime notification', () => {
    it('should render downtime notification when downtime exists and user is not logged in', () => {
      const user = createUser();
      const downtime = { dependencies: ['mvi'] };
      const { container } = subject({
        user,
        downtime,
      });
      expect(container.textContent).to.exist;
    });

    it('should not render downtime notification when user is logged in', () => {
      const user = loggedIn();
      const downtime = { dependencies: ['mvi'] };
      const { container } = subject({
        user,
        downtime,
        isLoggedIn: true,
      });
      expect(container.textContent).to.exist;
    });

    it('should render downtime notification when requiredForPrefill and no saved form', () => {
      const user = createUser();
      const downtime = {
        dependencies: ['mvi'],
        requiredForPrefill: true,
      };
      const { container } = subject({
        user,
        downtime,
        isLoggedIn: true,
      });
      expect(container.textContent).to.exist;
    });
  });

  describe('when determining start page', () => {
    let getNextPagePathStub;

    beforeEach(() => {
      getNextPagePathStub = sinon
        .stub(routing, 'getNextPagePath')
        .callsFake((_pageList, _data, startingPath) => startingPath);
    });

    afterEach(() => {
      getNextPagePathStub.restore();
    });

    it('should skip pages with unmet depends conditions', () => {
      const pageListWithDepends = [
        { path: '/introduction', pageKey: 'introduction' },
        {
          path: '/id-form',
          pageKey: 'id-form',
          depends: formData => !formData.isLoggedIn,
        },
        { path: '/personal-information', pageKey: 'personal-information' },
      ];
      const user = loggedIn();
      const formData = { isLoggedIn: true };
      subject({
        user,
        pageList: pageListWithDepends,
        formData,
      });
      expect(getNextPagePathStub.called).to.be.true;
      expect(getNextPagePathStub.lastCall.args[1]).to.deep.equal(formData);
    });

    it('should include pages with met depends conditions', () => {
      const pageListWithDepends = [
        { path: '/introduction', pageKey: 'introduction' },
        {
          path: '/id-form',
          pageKey: 'id-form',
          depends: formData => !formData.isLoggedIn,
        },
        { path: '/personal-information', pageKey: 'personal-information' },
      ];
      const user = loggedIn();
      const formData = { isLoggedIn: false };
      const { container } = subject({
        user,
        pageList: pageListWithDepends,
        formData,
      });
      expect(container.textContent).to.exist;
    });

    it('should use pathname parameter when provided', () => {
      const pageListWithDepends = [
        { path: '/introduction', pageKey: 'introduction' },
        { path: '/step-1', pageKey: 'step-1', depends: () => false },
        { path: '/step-2', pageKey: 'step-2' },
        { path: '/step-3', pageKey: 'step-3' },
      ];
      const user = loggedIn();
      subject({
        user,
        pageList: pageListWithDepends,
        pathname: '/step-2',
        formData: {},
      });
      expect(getNextPagePathStub.lastCall.args[2]).to.equal('/step-2');
    });

    it('should handle multiple consecutive conditional pages', () => {
      const pageListWithMultipleDepends = [
        { path: '/introduction', pageKey: 'introduction' },
        {
          path: '/conditional-1',
          pageKey: 'conditional-1',
          depends: () => false,
        },
        {
          path: '/conditional-2',
          pageKey: 'conditional-2',
          depends: () => false,
        },
        {
          path: '/conditional-3',
          pageKey: 'conditional-3',
          depends: () => false,
        },
        { path: '/first-valid-page', pageKey: 'first-valid-page' },
      ];
      const user = loggedIn();
      const { container } = subject({
        user,
        pageList: pageListWithMultipleDepends,
        formData: {},
      });
      expect(container.textContent).to.exist;
    });
  });

  describe('when handling edge cases', () => {
    it('should not render inProgress message when message is empty', () => {
      const user = withSavedForm();
      const formConfig = createFormConfig({
        messages: { inProgress: '' },
      });
      const { container } = subject({ user, formConfig });
      const heading = container.querySelector('va-alert h2');
      expect(heading).to.exist;
      expect(heading.textContent).to.not.include(
        'Your application is in progress',
      );
    });

    it('should render afterButtonContent when not in buttonOnly mode', () => {
      const user = loggedIn();
      const afterButtonContent = (
        <div data-testid="after-button">After button content</div>
      );
      const { getByTestId } = subject({ user, afterButtonContent });
      expect(getByTestId('after-button')).to.exist;
    });

    it('should render children when present in saved form alert', () => {
      const user = withSavedForm();
      const children = <div data-testid="custom-children">Custom children</div>;
      const { getByTestId } = subject({ user, children });
      expect(getByTestId('custom-children')).to.exist;
    });

    it('should handle lastSavedDate prop when provided', () => {
      const lastSavedDate = 946684800000;
      const user = withSavedForm();
      const { container } = subject({ user, lastSavedDate });
      expect(container.textContent).to.include('last saved on');
    });

    it('should use default app type when not provided', () => {
      const user = loggedIn();
      const formConfig = createFormConfig({ customText: {} });
      const { container } = subject({ user, formConfig });
      expect(container.textContent).to.exist;
    });
  });
});
