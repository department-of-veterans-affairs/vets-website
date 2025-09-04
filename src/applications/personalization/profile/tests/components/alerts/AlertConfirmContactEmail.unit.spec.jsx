import React from 'react';
import { expect } from 'chai';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { AlertConfirmContactEmail } from '~/applications/personalization/profile/components/alerts/AlertConfirmContactEmail';

describe('AlertConfirmContactEmail', () => {
  it('renders', () => {
    const { getByText } = render(<AlertConfirmContactEmail />);
    const h2Content = /Confirm your contact email address/;
    expect(getByText(h2Content)).to.exist;
    const pContent = /We’ll send all VA notifications to the contact email/;
    expect(getByText(pContent)).to.exist;
  });

  it('sets CONTACT_EMAIL_CONFIRMED=true cookie when VaAlert is closed', async () => {
    const originalCookie = document.cookie;
    document.cookie = '';

    const { container } = render(<AlertConfirmContactEmail />);

    const vaAlert = container.querySelector('va-alert');
    fireEvent(vaAlert, new CustomEvent('closeEvent'));

    await waitFor(() => {
      expect(document.cookie).to.exist;
      expect(document.cookie).to.include('CONTACT_EMAIL_CONFIRMED=true');
    });

    document.cookie = originalCookie;
  });
});
