import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import SignInModal from 'platform/user/authentication/components/SignInModal';

const generateStore = (enabled = false) => ({
  featureToggles: {
    // eslint-disable-next-line camelcase
    sign_in_service_enabled: enabled,
  },
});

describe('SignInModal', () => {
  const oldDataLayer = global.window.dataLayer;

  afterEach(() => {
    global.window.dataLayer = oldDataLayer;
  });

  it('should NOT render if `visible` is set to false', () => {
    const screen = renderInReduxProvider(<SignInModal />, {
      initialState: generateStore(),
    });
    const modal = $('va-modal[visible]', screen.container);
    expect(modal).to.be.null;
  });

  it('should render if `visible` is set to true', () => {
    const screen = renderInReduxProvider(<SignInModal visible />, {
      initialState: generateStore(),
    });
    const modal = $('va-modal[visible]', screen.container);
    expect(modal).to.not.be.null;
    expect(screen.queryByText('Sign in or create an account')).to.not.be.null;
  });

  it('should verify the close button works as expected', () => {
    const onClose = sinon.spy();
    const screen = renderInReduxProvider(
      <SignInModal visible onClose={onClose} />,
      {
        initialState: generateStore(),
      },
    );

    $('va-modal', screen.container).__events.closeEvent();

    expect(onClose.called).to.be.true;
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
    const screen = renderInReduxProvider(<SignInModal visible />, {
      initialState: generateStore(),
    });

    expect(screen.getByText('Sign in or create an account')).to.exist;
  });
});
