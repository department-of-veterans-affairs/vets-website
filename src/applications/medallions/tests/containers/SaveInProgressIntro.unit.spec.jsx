import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
// import sinon from 'sinon';
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

  it('renders "Start your application without signing in" link if user is not logged in', () => {
    const { getByText } = render(<SaveInProgressIntro {...defaultProps} />);
    expect(getByText(/start your application without signing in/i)).to.exist;
  });

  // it('renders loading indicator when profile is loading', () => {
  //   const props = {
  //     ...defaultProps,
  //     user: {
  //       ...defaultProps.user,
  //       profile: { ...defaultProps.user.profile, loading: true },
  //     },
  //   };
  //   const { getByText } = render(<SaveInProgressIntro {...props} />);
  //   expect(
  //     getByText(
  //       /checking to see if you have a saved version of this application/i,
  //     ),
  //   ).to.exist;
  // });

  it('renders resume message if user is logged in and has a saved form', () => {
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
    expect(getByText(/will expire on/i)).to.exist;
  });

  it('renders expired message if saved form is expired', () => {
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
                expiresAt: Math.floor(Date.now() / 1000) - 86400,
                lastUpdated: Math.floor(Date.now() / 1000) - 2000,
              },
            },
          ],
        },
      },
    };
    const { getByText } = render(<SaveInProgressIntro {...props} />);
    expect(getByText(/your application has expired/i)).to.exist;
  });

  // it('calls toggleLoginModal when unauth start button is clicked', () => {
  //   const toggleLoginModal = sinon.spy();
  //   const props = {
  //     ...defaultProps,
  //     toggleLoginModal,
  //     unauthStartText: 'Sign in to start your application',
  //   };
  //   const { getByText } = render(<SaveInProgressIntro {...props} />);
  //   const button = getByText(/sign in to start your application/i);
  //   fireEvent.click(button);
  //   expect(toggleLoginModal.calledOnce).to.be.true;
  // });

  it('renders custom sign-in message if renderSignInMessage is provided', () => {
    const props = {
      ...defaultProps,
      renderSignInMessage: () => <div>Custom sign-in message</div>,
    };
    const { getByText } = render(<SaveInProgressIntro {...props} />);
    expect(getByText(/custom sign-in message/i)).to.exist;
  });

  it('does not render if resumeOnly is true and no saved form', () => {
    const props = {
      ...defaultProps,
      resumeOnly: true,
    };
    const { container } = render(<SaveInProgressIntro {...props} />);
    expect(container.innerHTML).to.equal('');
  });

  it('renders afterButtonContent if provided', () => {
    const props = {
      ...defaultProps,
      afterButtonContent: <div data-testid="after-content">After content</div>,
    };
    const { getByTestId } = render(<SaveInProgressIntro {...props} />);
    expect(getByTestId('after-content')).to.exist;
  });
});
