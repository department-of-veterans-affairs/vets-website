import React from 'react';
import { render, screen } from '@testing-library/react';
import CreateAccount from './CreateAccount';
import { expect } from 'chai';

describe('CreateAccount', () => {
  it('renders the heading and description', () => {
    render(<CreateAccount />);

    expect($('h1', container).textContent).to.eql('Create an account now');

    expect(
      screen.getByText(/You’ll need to sign in with an identity-verified Login.gov or ID.me account./i)
    ).to.not.be.null;
  });

  it('renders two VaLinkAction buttons with correct text and hrefs', () => {
    render(<CreateAccount />);

    const idmeButton = screen.getByText(/Create an account with ID.me/i);
    expect(idmeButton).to.not.be.null;
    expect(idmeButton.closest('a')).toHaveAttribute('href', '');

    const dsLogonButton = screen.getByText(/Create an account with DSLogon/i);
    expect(dsLogonButton).to.not.be.null;
    expect(dsLogonButton.closest('a')).toHaveAttribute('href', 'https://secure.login.gov/sign_up/enter_email');
  });

  it('renders the correct number of VaLinkAction buttons', () => {
    render(<CreateAccount />);
    const linkButtons = screen.getAllByRole('link');
    expect(linkButtons).toHaveLength(2);
  });
});