import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { fireEvent, waitFor, render } from '@testing-library/react';
import { UnauthenticatedPageContent } from '../../components/UnauthenticatedPageContent';

describe('connect health devices landing page, user not logged in', () => {
  it('renders the unauthenticated page', () => {
    const dhpContainer = renderInReduxProvider(<UnauthenticatedPageContent />);
    const title = 'Please sign in to connect a device';

    expect(dhpContainer.getByText(title)).to.exist;
  });

  it('should open the login modal when the "Sign in or create an account" button is clicked', async () => {
    const screen = render(<UnauthenticatedPageContent />);
    const title = 'Sign in or create an account';
    const button = screen.getByRole('button', { name: title });
    expect(button).to.exist;

    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.findByText('Having trouble signing in?')).to.exist;
    });
    expect(screen.findByText('Sign in with Login.gov')).to.exist;
    expect(screen.findByText('Sign in with ID.me')).to.exist;
  });
});
