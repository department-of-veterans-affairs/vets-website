import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { SaveInProgressIntro } from '../../containers/SaveInProgressIntro';

before(() => {
  if (!window.customElements) {
    window.customElements = { define: () => {}, get: () => {} };
  }
  ['va-alert', 'va-button', 'va-loading-indicator', 'va-modal'].forEach(tag => {
    if (!window.customElements.get(tag)) {
      window.customElements.define(tag, class extends HTMLElement {});
    }
  });
});

const defaultProps = {
  fetchInProgressForm: () => {},
  removeInProgressForm: () => {},
  toggleLoginModal: () => {},
  formId: 'test-form',
  pageList: [{ path: 'introduction' }, { path: 'start' }],
  formConfig: {
    customText: { appType: 'application', appAction: 'applying' },
  },
  prefillEnabled: true,
  headingLevel: 2,
  startText: 'Start application',
  unauthStartText: 'Sign in to start your application',
  messages: {},
  migrations: [],
  resumeOnly: false,
  buttonOnly: false,
  retentionPeriod: '60 days',
  retentionPeriodStart: 'when you start',
  user: {
    profile: {
      loading: false,
      prefillsAvailable: ['test-form'],
      savedForms: [],
    },
    login: {
      currentlyLoggedIn: false,
    },
  },
};

describe('SaveInProgressIntro', () => {
  it('renders without crashing', () => {
    render(<SaveInProgressIntro {...defaultProps} />);
  });

  it('uses getNextPagePath when pathname is provided', () => {
    const props = {
      ...defaultProps,
      pathname: 'introduction',
      user: {
        ...defaultProps.user,
        login: { currentlyLoggedIn: true },
        profile: {
          ...defaultProps.user.profile,
          savedForms: [
            {
              form: 'test-form',
              metadata: {
                expiresAt: Math.floor(Date.now() / 1000) + 86400,
                lastUpdated: Math.floor(Date.now() / 1000) - 1000,
              },
            },
          ],
        },
      },
    };
    const { getByText } = render(<SaveInProgressIntro {...props} />);
    expect(getByText(/you can continue applying now/i)).to.exist;
  });

  it('renders generic prefill alert when prefillAvailable and no verifiedPrefillAlert', () => {
    const props = {
      ...defaultProps,
      user: {
        ...defaultProps.user,
        login: { currentlyLoggedIn: true },
        profile: {
          ...defaultProps.user.profile,
          prefillsAvailable: ['test-form'],
          savedForms: [],
        },
      },
    };
    const { getByText } = render(<SaveInProgressIntro {...props} />);
    expect(getByText(/we've prefilled some of your information/i)).to.exist;
  });

  it('renders verifiedPrefillAlert if provided and prefillAvailable', () => {
    const verifiedPrefillAlert = (
      <div data-testid="verified-alert">Verified Prefill</div>
    );
    const props = {
      ...defaultProps,
      verifiedPrefillAlert,
      user: {
        ...defaultProps.user,
        login: { currentlyLoggedIn: true },
        profile: {
          ...defaultProps.user.profile,
          prefillsAvailable: ['test-form'],
          savedForms: [],
        },
      },
    };
    const { getByTestId } = render(<SaveInProgressIntro {...props} />);
    expect(getByTestId('verified-alert')).to.exist;
  });

  it('renders generic signed-in alert when no prefill available and no verifiedPrefillAlert', () => {
    const props = {
      ...defaultProps,
      user: {
        ...defaultProps.user,
        login: { currentlyLoggedIn: true },
        profile: {
          ...defaultProps.user.profile,
          prefillsAvailable: [],
          savedForms: [],
        },
      },
    };
    const { getByText } = render(<SaveInProgressIntro {...props} />);
    expect(
      getByText(
        /we can prefill part of your application based on your account details/i,
      ),
    ).to.exist;
  });

  it('shows "start without signing in" link if user is not logged in', () => {
    const { getByText } = render(<SaveInProgressIntro {...defaultProps} />);
    expect(getByText(/start your application without signing in/i)).to.exist;
  });

  describe('when user is logged in', () => {
    const now = Math.floor(Date.now() / 1000);

    it('shows resume message with valid saved form', () => {
      const props = {
        ...defaultProps,
        user: {
          ...defaultProps.user,
          login: { currentlyLoggedIn: true },
          profile: {
            ...defaultProps.user.profile,
            savedForms: [
              {
                form: 'test-form',
                metadata: {
                  expiresAt: now + 86400,
                  lastUpdated: now - 1000,
                },
              },
            ],
          },
        },
      };
      const { getByText } = render(<SaveInProgressIntro {...props} />);
      expect(getByText(/you can continue applying now/i)).to.exist;
      expect(getByText(/will expire on/i)).to.exist;
    });

    it('shows expired message if saved form is expired', () => {
      const props = {
        ...defaultProps,
        user: {
          ...defaultProps.user,
          login: { currentlyLoggedIn: true },
          profile: {
            ...defaultProps.user.profile,
            savedForms: [
              {
                form: 'test-form',
                metadata: {
                  expiresAt: now - 86400,
                  lastUpdated: now - 2000,
                },
              },
            ],
          },
        },
      };
      const { getByText } = render(<SaveInProgressIntro {...props} />);
      expect(getByText(/your application has expired/i)).to.exist;
    });
  });

  it('renders custom sign-in message when provided', () => {
    const props = {
      ...defaultProps,
      renderSignInMessage: () => <div>Custom sign-in message</div>,
    };
    const { getByText } = render(<SaveInProgressIntro {...props} />);
    expect(getByText(/custom sign-in message/i)).to.exist;
  });

  it('does not render when resumeOnly is true and no saved form', () => {
    const props = {
      ...defaultProps,
      resumeOnly: true,
    };
    const { container } = render(<SaveInProgressIntro {...props} />);
    expect(container.innerHTML).to.equal('');
  });

  it('renders afterButtonContent when provided', () => {
    const props = {
      ...defaultProps,
      afterButtonContent: <div data-testid="after-content">After content</div>,
    };
    const { getByTestId } = render(<SaveInProgressIntro {...props} />);
    expect(getByTestId('after-content')).to.exist;
  });

  describe('SaveInProgressIntro – missing branches', () => {
    it('renders generic save message when prefillEnabled is false', () => {
      const props = {
        ...defaultProps,
        prefillEnabled: false,
      };
      const { getByText } = render(<SaveInProgressIntro {...props} />);
      expect(getByText(/finish filling it out/i)).to.exist;
    });

    it('renders loading indicator when profile.loading is true', () => {
      const props = {
        ...defaultProps,
        user: {
          ...defaultProps.user,
          profile: {
            ...defaultProps.user.profile,
            loading: true,
          },
        },
      };
      const { container } = render(<SaveInProgressIntro {...props} />);
      const loader = container.querySelector('va-loading-indicator');
      expect(loader).to.exist;
      expect(loader.getAttribute('message')).to.match(
        /Checking to see if you have a saved version of this application/,
      );
    });

    it('renders only sign-in button and start link when buttonOnly is true', () => {
      const props = {
        ...defaultProps,
        buttonOnly: true,
      };
      const { container, getByText } = render(
        <SaveInProgressIntro {...props} />,
      );
      const btn = container.querySelector('va-button');
      expect(btn).to.exist;
      expect(btn.getAttribute('text')).to.equal(defaultProps.unauthStartText);
      expect(getByText(/start your application without signing in/i)).to.exist;
    });

    it('renders unverifiedPrefillAlert when verifyRequiredPrefill is true', () => {
      const unverifiedPrefillAlert = (
        <div data-testid="unverified-alert">Unverified Alert</div>
      );
      const props = {
        ...defaultProps,
        prefillEnabled: true,
        verifyRequiredPrefill: true,
        unverifiedPrefillAlert,
      };
      const { getByTestId } = render(<SaveInProgressIntro {...props} />);
      expect(getByTestId('unverified-alert')).to.exist;
    });
  });
});
