import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { render } from '../unit-spec-helpers';
import HeaderLayout from '../../components/HeaderLayout';

describe('MHV Landing Page -- Header Layout', () => {
  it('renders', async () => {
    const { getByTestId } = render(<HeaderLayout />);
    await waitFor(() => {
      getByTestId('mhv-header-layout--milestone-2');
    });
  });
  it('renders OH/My VA Health link when told to', async () => {
    const { getByTestId, getByRole } = render(<HeaderLayout isCerner />);
    await waitFor(() => {
      getByTestId('mhv-header-layout--milestone-2');
      const ohLink = getByRole('link', {
        name: /Go to the My VA Health portal/,
      });
      expect(ohLink.href).to.match(/patientportal\.myhealth\.va\.gov/);
    });
  });

  it('renders a link to confirm contact email', () => {
    const { getByTestId } = render(<HeaderLayout />);
    const testId = 'va-profile--confirm-contact-email-link';
    const confirmEmailLink = getByTestId(testId);
    expect(confirmEmailLink).to.exist;
    const href = '/profile/contact-information#contact-email-address';
    expect(confirmEmailLink.link).to.equal(href);
    const textContent = /^Confirm your contact email address/;
    expect(confirmEmailLink.text).to.match(textContent);
  });

  it('suppresses the email confirmation link when CONTACT_EMAIL_CONFIRMED cookie is set', () => {
    const originalCookie = document.cookie;
    document.cookie = 'CONTACT_EMAIL_CONFIRMED=true';
    const { queryByTestId } = render(<HeaderLayout />);
    const testId = 'va-profile--confirm-contact-email-link';
    const confirmEmailLink = queryByTestId(testId);
    expect(confirmEmailLink).to.not.exist;
    document.cookie = originalCookie;
  });
});
