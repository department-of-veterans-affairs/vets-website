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

  it.skip('should append the `oauth` query parameter', () => {
    const screen = renderInReduxProvider(<SignInModal visible />, {
      initialState: generateStore(true),
    });

    const url = new URL(window.location);
    expect(screen.queryByText('Sign in')).to.not.be.null;
    expect(url.searchParams.get('next')).to.eql('loginModal');
    expect(url.searchParams.get('oauth')).to.eql('true');
  });
});
