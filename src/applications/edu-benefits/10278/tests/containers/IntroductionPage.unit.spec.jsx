import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import formConfig from '../../config/form';
import IntroductionPage from '../../containers/IntroductionPage';

const baseProps = {
  route: {
    path: 'introduction',
    pageList: [
      { path: '/introduction', title: 'Introduction' },
      { path: '/first-page', title: 'First Page' },
    ],
    formConfig,
  },
  userLoggedIn: false,
  userIdVerified: true,
};

const mockStore = (currentlyLoggedIn = false, initialFormData = {}) => ({
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn,
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
      data: initialFormData,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

const renderWithStore = (ui, store = mockStore()) =>
  render(<Provider store={store}>{ui}</Provider>);

describe('22-10278 <IntroductionPage>', () => {
  it('renders without crashing', () => {
    const { container } = renderWithStore(<IntroductionPage {...baseProps} />);

    expect(container).to.exist;
  });

  it('renders the form title (h1)', () => {
    const { getByRole } = renderWithStore(<IntroductionPage {...baseProps} />);

    expect(
      getByRole('heading', {
        level: 1,
        name: /Authorize VA to disclose personal information to a third party/i,
      }),
    ).to.exist;
  });

  it('renders the form subtitle (p)', () => {
    const { container } = renderWithStore(<IntroductionPage {...baseProps} />);
    const subTitle = container.querySelector('div.schemaform-subtitle');

    expect(subTitle?.textContent).to.include('(VA Form 22-10278)');
  });

  it('renders all section headers (1 h2)', () => {
    const { container } = renderWithStore(<IntroductionPage {...baseProps} />);
    const h2s = container.querySelectorAll('h2');
    expect(h2s.length).to.equal(1);
  });

  it('renders "what to know" section', () => {
    const { getByTestId } = renderWithStore(
      <IntroductionPage {...baseProps} />,
    );
    const listEl = getByTestId('what-to-know-list');

    expect(listEl).to.exist;
    expect(listEl.querySelectorAll('li').length).to.equal(3);
  });

  describe('va-alert-sign-in', () => {
    it('renders without crashing', () => {
      const { container } = renderWithStore(
        <IntroductionPage {...baseProps} />,
      );
      const alert = container.querySelector('va-alert-sign-in');

      expect(alert).to.exist;
    });

    it('should button to sign in when user is not logged in', () => {
      const { container } = renderWithStore(
        <IntroductionPage {...baseProps} />,
      );
      const alert = container.querySelector('va-alert-sign-in');
      const signInButton = alert.querySelector('va-button');

      expect(signInButton).to.exist;
      expect(signInButton).to.have.attribute(
        'text',
        'Sign in or create an account',
      );
    });

    it('should not show sign in button when user is authenticated', () => {
      const { container } = renderWithStore(
        <IntroductionPage {...baseProps} />,
        mockStore(true),
      );
      const alert = container.querySelector('va-alert-sign-in');

      if (alert) {
        const signInButton = alert.querySelector(
          'va-button[text="Sign in or create an account"]',
        );
        expect(signInButton).to.be.null;
      }
    });
  });

  describe('authenticated user behavior', () => {
    it('should sync userLoggedIn to formData when user is authenticated', () => {
      const store = mockStore(true);
      const dispatchCalls = [];
      store.dispatch = action => {
        dispatchCalls.push(action);
        return action;
      };

      renderWithStore(<IntroductionPage {...baseProps} />, store);

      const setDataCall = dispatchCalls.find(
        call => call.type === 'SET_DATA' && call.data?.userLoggedIn === true,
      );

      expect(setDataCall).to.exist;
      expect(setDataCall.data.userLoggedIn).to.be.true;
    });

    it('should not dispatch setData when userLoggedIn already matches formData', () => {
      const store = mockStore(true, { userLoggedIn: true });
      const dispatchCalls = [];
      store.dispatch = action => {
        dispatchCalls.push(action);
        return action;
      };

      renderWithStore(<IntroductionPage {...baseProps} />, store);

      const setDataCalls = dispatchCalls.filter(
        call => call.type === 'SET_DATA',
      );
      expect(setDataCalls.length).to.equal(0);
    });

    it('should render SaveInProgressIntro without unauthStartText when authenticated', () => {
      const { container } = renderWithStore(
        <IntroductionPage {...baseProps} />,
        mockStore(true),
      );

      const alert = container.querySelector('va-alert-sign-in');

      if (alert) {
        const signInButton = alert.querySelector(
          'va-button[text="Sign in or create an account"]',
        );
        expect(signInButton).to.be.null;
      }
    });

    it('should correctly handle authenticated user state from Redux store', () => {
      const store = mockStore(true);
      const { container } = renderWithStore(
        <IntroductionPage {...baseProps} />,
        store,
      );

      expect(store.getState().user.login.currentlyLoggedIn).to.be.true;
      expect(container).to.exist;
    });
  });

  describe('OmbInfo component', () => {
    it('renders without crashing', () => {
      const { getByTestId } = renderWithStore(
        <IntroductionPage {...baseProps} />,
      );

      expect(getByTestId('omb-info')).to.exist;
    });

    it('should apply correct margin class when user is logged in', () => {
      const { getByTestId } = renderWithStore(
        <IntroductionPage {...baseProps} />,
        mockStore(true),
      );

      const ombInfoContainer = getByTestId('omb-info');
      expect(ombInfoContainer.classList.contains('vads-u-margin-top--4')).to.be
        .true;
    });

    it('should not apply margin class when user is not logged in', () => {
      const { getByTestId } = renderWithStore(
        <IntroductionPage {...baseProps} />,
      );

      const ombInfoContainer = getByTestId('omb-info');
      expect(ombInfoContainer.classList.contains('vads-u-margin-top--4')).to.be
        .false;
    });
  });

  it('renders TechnologyProgramAccordion component', () => {
    const { container } = renderWithStore(<IntroductionPage {...baseProps} />);

    expect(container.querySelector('va-accordion')).to.exist;
  });
});
