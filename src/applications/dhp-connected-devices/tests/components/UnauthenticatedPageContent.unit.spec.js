import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { fireEvent, waitFor, render } from '@testing-library/react';
import { UnauthenticatedPageContent } from '../../components/UnauthenticatedPageContent';

describe('connect health devices landing page, user not logged in', () => {
  it('renders the unauthenticated page', () => {
    const { container, getByText } = renderInReduxProvider(
      <UnauthenticatedPageContent />,
    );
    const title = 'Connected devices';

    expect(getByText(title)).to.exist;
    expect($('va-alert-sign-in[variant="signInRequired"]', container)).to.exist;
  });

  it('should open the login modal when the "Sign in or create an account" button is clicked', async () => {
    const { container, findByText } = render(<UnauthenticatedPageContent />);
    const button = $('va-button', container);
    expect(button).to.exist;

    fireEvent.click(button);
    await waitFor(() => {
      expect(findByText('Having trouble signing in?')).to.exist;
    });
    expect(findByText('Sign in with Login.gov')).to.exist;
    expect(findByText('Sign in with ID.me')).to.exist;
  });
});
