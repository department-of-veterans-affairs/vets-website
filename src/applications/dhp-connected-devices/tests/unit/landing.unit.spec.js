import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import DhpApp from '../../containers/App';

describe('connect health devices landing page', () => {
  it('App renders', () => {
    const dhpContainer = renderInReduxProvider(<DhpApp />);
    const title = 'Connect your health devices';

    expect(dhpContainer.getByText(title)).to.exist;
  });

  it("App renders 'Sign in or create account' button if user NOT logged in", () => {
    const screen = renderInReduxProvider(<DhpApp />);
    expect(screen.getByText(/Sign in or create an account/)).to.exist;
  });
});

// Page loads with:
// title (done)
// faq accordians exist
// Page loads login buttons when user NOT logged in (need to test that the modal comes up, but the button's presence is tested)
// Page loads with url and "connected devices" when user IS logged in

// [Mock API] Redirect back to dhp page after create AND user logged in
// [Mock API] Redirect back to dhp page after login  AND user logged in
