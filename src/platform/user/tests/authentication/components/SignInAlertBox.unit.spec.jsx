import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import SignInAlertBox from '../../../authentication/components/SignInAlertBox';

describe('SignInAlertBox', () => {
  it('should render', () => {
    const wrapper = render(<SignInAlertBox />);
    expect(wrapper.getByText(/Sign in with your Login.gov or ID.me account/i))
      .to.exist;
    expect(
      wrapper.getByText(
        `Soon all VA websites will follow a new, more secure sign-in process. You’ll need to sign in using your Login.gov or ID.me account. So you’re ready for the change, try signing in now with Login.gov or ID.me.`,
      ),
    ).to.exist;
  });
});
