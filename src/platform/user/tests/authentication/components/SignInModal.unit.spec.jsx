import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import * as actions from 'platform/site-wide/user-nav/actions';
import SignInModal from 'platform/user/authentication/components/SignInModal';

const generateStore = ({
  featureEnabled = true,
  showLoginModal = true,
} = {}) => ({
  navigation: { showLoginModal },
  featureToggles: {
    // eslint-disable-next-line camelcase
    sign_in_service_enabled: featureEnabled,
  },
});

describe('SignInModal', () => {
  it('should NOT render if `visible` is set to false', () => {
    const screen = renderInReduxProvider(<SignInModal />, {
      initialState: generateStore({ showLoginModal: false }),
    });
    const modal = $('va-modal[visible]', screen.container);
    expect(modal).to.be.null;
  });

  it('should render if `visible` is set to true', () => {
    const screen = renderInReduxProvider(<SignInModal />, {
      initialState: generateStore(),
    });
    const modal = $('va-modal[visible]', screen.container);
    expect(modal).to.not.be.null;
    expect(screen.queryByText('Sign in or create an account')).to.not.be.null;
  });

  it('should verify the close button works as expected', () => {
    const closeEventSpy = sinon.spy(actions, 'toggleLoginModal');
    const screen = renderInReduxProvider(<SignInModal />, {
      initialState: generateStore(),
    });

    $('va-modal', screen.container).__events.closeEvent();

    expect(closeEventSpy.called).to.be.true;
  });

  // it('should record event when modal is opened', async () => {
  //   const screen = renderInReduxProvider(<SignInModal useSiS />, {
  //     initialState: generateStore(),
  //   });
  //   global.window.dataLayer = [];
  //   screen.rerender(<SignInModal visible useSiS />);
  //   expect(global.window.dataLayer).to.deep.include({
  //     event: 'login-modal-opened-oauth',
  //   });
  // });

  // it('should record event when modal is closed', () => {
  //   const screen = renderInReduxProvider(<SignInModal visible useSiS />, {
  //     initialState: generateStore(),
  //   });

  //   global.window.dataLayer = [];
  //   screen.rerender(<SignInModal visible={false} useSiS />);
  //   expect(global.window.dataLayer).to.deep.include({
  //     event: 'login-modal-closed-oauth',
  //   });
  // });

  it('should render the LoginContainer component', () => {
    const screen = renderInReduxProvider(<SignInModal />, {
      initialState: generateStore(),
    });

    expect(screen.getByText('Sign in or create an account')).to.exist;
  });
});
