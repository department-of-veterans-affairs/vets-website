import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent } from '@testing-library/react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import SignInModal from 'platform/user/authentication/components/SignInModal';

const generateStore = (enabled = false) => ({
  featureToggles: {
    // eslint-disable-next-line camelcase
    sign_in_service_enabled: enabled,
  },
});

describe('SignInModal', () => {
  const oldWindow = global.window;

  after(() => {
    global.window = oldWindow;
  });

  it('should NOT render if `visible` is set to false', () => {
    const screen = renderInReduxProvider(<SignInModal />, {
      initialState: generateStore(),
    });
    expect(screen.queryByText('Sign in')).to.be.null;
  });

  it('should render if `visible` is set to true', () => {
    const screen = renderInReduxProvider(<SignInModal visible />, {
      initialState: generateStore(),
    });
    expect(screen.queryByText('Sign in')).to.not.be.null;
  });

  it('should verify the close button works as expected', () => {
    const onClose = sinon.spy();
    const screen = renderInReduxProvider(
      <SignInModal visible onClose={onClose} />,
      {
        initialState: generateStore(),
      },
    );

    fireEvent.click(screen.queryByLabelText('close modal'));

    expect(onClose.called).to.be.true;
  });

  it('should record event when modal is opened', () => {
    const screen = renderInReduxProvider(<SignInModal useSiS />, {
      initialState: generateStore(),
    });

    window.dataLayer = [];
    screen.rerender(<SignInModal visible useSiS />);

    expect(window.dataLayer).to.deep.include({
      event: 'login-modal-opened-oauth',
    });
  });

  it('should record event when modal is closed', () => {
    const screen = renderInReduxProvider(<SignInModal visible useSiS />, {
      initialState: generateStore(),
    });

    window.dataLayer = [];
    screen.rerender(<SignInModal visible={false} useSiS />);

    expect(window.dataLayer).to.deep.include({
      event: 'login-modal-closed-oauth',
    });
  });

  it('should render the LoginContainer component', () => {
    const screen = renderInReduxProvider(<SignInModal visible />, {
      initialState: generateStore(),
    });

    expect(screen.getByText('Sign in')).to.exist;
  });
});
