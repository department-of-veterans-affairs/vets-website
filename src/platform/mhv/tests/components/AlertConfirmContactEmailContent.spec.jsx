import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderInReduxProvider as render } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import AlertConfirmContactEmailContent from 'platform/mhv/components/MhvAlertConfirmEmail/AlertConfirmContactEmailContent';

describe('<AlertConfirmContactEmailContent />', async () => {
  it('renders email text, email address, Confirm button, and Edit link', async () => {
    const { container, findByText, getByRole } = render(
      <AlertConfirmContactEmailContent
        emailAddress="vet@va.gov"
        onConfirmClick={() => {}}
      />,
    );

    await findByText(
      /We’ll send notifications about your VA health care and benefits to this email\./i,
    );

    await findByText('vet@va.gov');

    const confirmButton = getByRole('button', { name: /Confirm/i });
    expect(confirmButton).to.exist;

    const link = container.querySelector(
      'va-link[text="Go to profile to update your contact email"]',
    );
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(
      '/profile/contact-information#email-address',
    );
  });

  it('calls onConfirmClick when the Confirm button is clicked', async () => {
    const onConfirmClick = sinon.spy();

    const { getByRole } = render(
      <AlertConfirmContactEmailContent
        emailAddress="vet@va.gov"
        onConfirmClick={onConfirmClick}
      />,
    );

    const button = getByRole('button', { name: /Confirm/i });
    expect(button).to.exist;
    fireEvent.click(button);

    await waitFor(() => {
      expect(onConfirmClick.calledOnce).to.be.true;
    });
  });

  it('shows loading state when isConfirming is true', async () => {
    const { getByRole } = render(
      <AlertConfirmContactEmailContent
        emailAddress="vet@va.gov"
        onConfirmClick={() => {}}
        isConfirming
      />,
    );

    const button = getByRole('button');
    expect(button).to.exist;
    expect(button.disabled).to.be.true;
  });
});
