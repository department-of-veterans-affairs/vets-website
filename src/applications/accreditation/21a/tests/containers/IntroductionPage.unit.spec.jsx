import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { render, cleanup } from '@testing-library/react';
import sinon from 'sinon';
import * as ui from 'platform/utilities/ui';
import IntroductionPage from '../../containers/IntroductionPage';
import { SIGN_IN_URL_21A } from '../../constants';

const makeUserReducer = (loaCurrent, isLoggedIn = true) => () => ({
  profile: {
    loa: { current: loaCurrent },
    loading: false,
    prefillsAvailable: [],
    savedForms: [],
  },
  login: {
    currentlyLoggedIn: isLoggedIn,
  },
});

const formsReducer = () => ({
  formId: 'test-form-id',
  migrations: [],
  prefillTransformer: () => ({}),
  loadedData: { metadata: { returnUrl: '/' } },
  lastSavedDate: null,
  saveInProgress: {},
});

const rootReducer = userReducer =>
  combineReducers({
    user: userReducer,
    form: formsReducer,
  });

const mockRoute = {
  formConfig: {
    prefillEnabled: true,
    savedFormMessages: {
      notAuthenticated: 'You need to sign in to save your progress.',
      notAuthorized: 'You need to verify your identity to save your progress.',
      noAuth: 'You need to sign in to save your progress.',
    },
    title: 'Application for Accreditation as a Claims Agent or Attorney',
    subTitle: 'VA Form 21a',
  },
  pageList: [
    { path: '/personal-information', title: 'Personal Information' },
    { path: '/military-service', title: 'Military Service' },
  ],
};

describe('IntroductionPage', () => {
  beforeEach(() => {
    if (!ui.focusElement.isSinonStub) {
      sinon.stub(ui, 'focusElement').callsFake(() => {});
    }
  });

  afterEach(() => {
    cleanup();
    if (ui.focusElement.isSinonStub) {
      ui.focusElement.restore();
    }
  });

  describe('Component rendering', () => {
    it('renders the form title and subtitle', () => {
      const store = createStore(rootReducer(makeUserReducer(3)));
      const { getByTestId } = render(
        <Provider store={store}>
          <IntroductionPage route={mockRoute} />
        </Provider>,
      );

      expect(getByTestId('form-title')).to.exist;
      expect(getByTestId('form-subtitle')).to.exist;
    });

    it('renders the process list with all required sections', () => {
      const store = createStore(rootReducer(makeUserReducer(3)));
      const { container } = render(
        <Provider store={store}>
          <IntroductionPage route={mockRoute} />
        </Provider>,
      );

      const expectedSections = [
        'Personal information',
        'Military service history',
        'Employment information',
        'Education history',
        'Professional affiliations',
        'Background information',
        'Character references',
        'Optional supplementary statements',
        'Review application',
      ];

      expectedSections.forEach(section => {
        const elements = container.querySelectorAll(
          `va-process-list-item[header="${section}"]`,
        );
        expect(elements.length).to.be.greaterThan(0);
      });
    });

    it('renders the OMB information component', () => {
      const store = createStore(rootReducer(makeUserReducer(3)));
      const { container } = render(
        <Provider store={store}>
          <IntroductionPage route={mockRoute} />
        </Provider>,
      );

      const ombInfo = container.querySelector('va-omb-info');
      expect(ombInfo).to.exist;
    });
  });

  describe('User authentication states', () => {
    it('renders VerifyAlert for LOA1 users', () => {
      const store = createStore(rootReducer(makeUserReducer(1)));
      const { getByTestId, queryByText } = render(
        <Provider store={store}>
          <IntroductionPage route={mockRoute} />
        </Provider>,
      );

      expect(getByTestId('ezr-identity-alert')).to.exist;
      expect(queryByText('Start your Application')).to.not.exist;
    });

    it('renders SaveInProgressIntro for LOA3 users', () => {
      const store = createStore(rootReducer(makeUserReducer(3)));
      const { getByText, queryByTestId } = render(
        <Provider store={store}>
          <IntroductionPage route={mockRoute} />
        </Provider>,
      );

      expect(getByText('Start your Application')).to.exist;
      expect(queryByTestId('ezr-identity-alert')).to.not.exist;
    });

    it('renders SaveInProgressIntro for logged out users', () => {
      const store = createStore(rootReducer(makeUserReducer(3, false)));
      const { getByText, queryByTestId } = render(
        <Provider store={store}>
          <IntroductionPage route={mockRoute} />
        </Provider>,
      );

      expect(getByText('Sign in to start your application')).to.exist;
      expect(queryByTestId('ezr-identity-alert')).to.not.exist;
    });
  });

  describe('StartLink component', () => {
    it('renders as a regular link for logged in users', () => {
      const store = createStore(rootReducer(makeUserReducer(3)));
      const { container } = render(
        <Provider store={store}>
          <IntroductionPage route={mockRoute} />
        </Provider>,
      );

      const startLink = container.querySelector(
        'a.usa-button.usa-button-primary',
      );
      expect(startLink).to.exist;
      expect(startLink.href).to.not.include(SIGN_IN_URL_21A);
    });

    it('renders with sign-in URL for logged out users', () => {
      const store = createStore(rootReducer(makeUserReducer(3, false)));
      const { container } = render(
        <Provider store={store}>
          <IntroductionPage route={mockRoute} />
        </Provider>,
      );

      const startLink = container.querySelector(
        'a.usa-button.usa-button-primary',
      );
      expect(startLink).to.exist;
      expect(startLink.href).to.include(SIGN_IN_URL_21A);
    });
  });

  describe('Legal links', () => {
    it('renders correct CFR links', () => {
      const store = createStore(rootReducer(makeUserReducer(3)));
      const { container } = render(
        <Provider store={store}>
          <IntroductionPage route={mockRoute} />
        </Provider>,
      );

      const cfrLinks = container.querySelectorAll('va-link');
      expect(cfrLinks).to.have.length(2);

      const firstLink = cfrLinks[0];
      expect(firstLink.getAttribute('href')).to.equal(
        'https://www.law.cornell.edu/cfr/text/38/14.629',
      );
      expect(firstLink.getAttribute('text')).to.equal('38 C.F.R. § 14.629');

      const secondLink = cfrLinks[1];
      expect(secondLink.getAttribute('href')).to.equal(
        'https://www.law.cornell.edu/cfr/text/38/14.633',
      );
      expect(secondLink.getAttribute('text')).to.equal('38 C.F.R. § 14.633');
    });
  });

  describe('Alert styling', () => {
    it('renders warning alert with correct attributes', () => {
      const store = createStore(rootReducer(makeUserReducer(3)));
      const { container } = render(
        <Provider store={store}>
          <IntroductionPage route={mockRoute} />
        </Provider>,
      );

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert.getAttribute('status')).to.equal('warning');
      expect(alert.getAttribute('visible')).to.equal('true');
    });
  });
});
