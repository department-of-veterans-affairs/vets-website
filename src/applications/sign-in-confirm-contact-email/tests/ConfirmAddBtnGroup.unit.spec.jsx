import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import ConfirmAddBtnGroup from '../components/ConfirmAddBtnGroup';

describe('ConfirmAddBtnGroup', () => {
  it('should render the add email link when no email provided', () => {
    const noEmailProvided = 'No email provided';
    const { container } = render(
      <ConfirmAddBtnGroup email={noEmailProvided} />,
    );
    const link = container.querySelector('va-link-action');
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal('/profile/contact-information');
    expect(link.getAttribute('text')).to.equal('Add email in profile');
  });

  it('should render Confirm and Update buttons when email is provided', () => {
    const email = 'test@test.com';
    const { container } = render(<ConfirmAddBtnGroup email={email} />);

    const confirmButton = container.querySelector('.confirm-button');
    expect(confirmButton.getAttribute('text')).to.equal('Confirm');
    expect(confirmButton.getAttribute('aria-label')).to.equal(
      'Confirm Contact Email',
    );

    const updateButton = container.querySelector('.update-button');
    expect(updateButton.getAttribute('text')).to.equal(
      'Update email in profile',
    );
    expect(updateButton.getAttribute('aria-label')).to.equal(
      'Update Contact Email',
    );
  });

  it('should call handleConfirmation when Confirm button is clicked', async () => {
    const email = 'test@test.com';
    const handleConfirmation = sinon.spy();
    const { container } = render(
      <ConfirmAddBtnGroup
        email={email}
        handleConfirmation={handleConfirmation}
      />,
    );

    const confirmButton = container.querySelector('.confirm-button');
    expect(confirmButton).to.exist;
    await fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(handleConfirmation.calledOnce).to.be.true;
    });
  });

  it('should redirect to profile contact information when Update button is clicked', async () => {
    const email = 'test@test.com';
    const { container } = render(<ConfirmAddBtnGroup email={email} />);

    const updateButton = container.querySelector('.update-button');
    expect(updateButton).to.exist;
    const originalLocation = window.location;
    window.location = { href: '' };

    await fireEvent.click(updateButton);
    await waitFor(() => {
      expect(window.location.pathname).to.equal('/profile/contact-information');
      window.location = originalLocation;
    });
  });
});
