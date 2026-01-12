import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderInReduxProvider as render } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import { ProfileAlertConfirmEmailContent } from 'platform/mhv/components/MhvAlertConfirmEmail/ProfileAlertConfirmEmailContent';

describe('<ProfileAlertConfirmEmailContent />', () => {
  it('renders text, email address, Confirm button, and Edit button', async () => {
    const { container, findByText, getByTestId } = render(
      <ProfileAlertConfirmEmailContent
        emailAddress="vet@va.gov"
        onConfirmClick={() => {}}
        onEditClick={() => {}}
      />,
    );

    await findByText(
      /We’ll send notifications about your VA health care and benefits to this email\./i,
    );

    await findByText('vet@va.gov');

    const confirmButton = getByTestId('mhv-alert--confirm-email-button');
    expect(confirmButton).to.exist;

    const editButton = container.querySelector(
      'va-button[text="Edit contact email"]',
    );
    expect(editButton).to.exist;
  });

  it('calls onConfirmClick when Confirm button is clicked', async () => {
    const onConfirmClick = sinon.spy();

    const { getByTestId } = render(
      <ProfileAlertConfirmEmailContent
        emailAddress="vet@va.gov"
        onConfirmClick={onConfirmClick}
        onEditClick={() => {}}
      />,
    );

    const button = getByTestId('mhv-alert--confirm-email-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(onConfirmClick.calledOnce).to.be.true;
    });
  });

  it('calls onEditClick when Edit button is clicked', async () => {
    const onEditClick = sinon.spy();

    const { container } = render(
      <ProfileAlertConfirmEmailContent
        emailAddress="vet@va.gov"
        onConfirmClick={() => {}}
        onEditClick={onEditClick}
      />,
    );

    const editButton = container.querySelector(
      'va-button[text="Edit contact email"]',
    );
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(onEditClick.calledOnce).to.be.true;
    });
  });

  it('shows loading state and hides Edit button when isConfirming is true', async () => {
    const { container, getByTestId } = render(
      <ProfileAlertConfirmEmailContent
        emailAddress="vet@va.gov"
        onConfirmClick={() => {}}
        onEditClick={() => {}}
        isConfirming
      />,
    );

    const confirmButton = getByTestId('mhv-alert--confirm-email-button');
    expect(confirmButton).to.exist;
    expect(confirmButton.getAttribute('loading')).to.equal('true');

    const editButton = container.querySelector(
      'va-button[text="Edit contact email"]',
    );
    expect(editButton).to.be.null;
  });
});
