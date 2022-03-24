import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import DhpApp from '../../containers/App';

describe('connect health devices landing page', () => {
  it('App renders', () => {
    const dhpContainer = render(<DhpApp />);
    const title = 'Connect your health devices';

    expect(dhpContainer.getByText(title)).to.exist;
  });

  xit('App renders sign in or create account button if user NOT logged in', () => {
    const dhpContainer = render(<DhpApp />);
    const buttonText = 'Sign in or create an account';

    expect(dhpContainer.queryByTestId('sign-in-button')).to.have.text(
      buttonText,
    );
    //
    // expect button to exist; search id or test-id
    // if button exist, should contain buttonText
    // if button exist, href should exist
  });
});

// Page loads with:
// title
// faq accordians exist
// Page loads login buttons when user NOT logged in
// Page loads with url and "connected devices" when user IS logged in

// [Mock API] Redirect back to dhp page after create AND user logged in
// [Mock API] Redirect back to dhp page after login  AND user logged in
