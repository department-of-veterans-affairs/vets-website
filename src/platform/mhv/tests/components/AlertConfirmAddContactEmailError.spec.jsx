import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderInReduxProvider as render } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import AlertConfirmAddContactEmailError from '../../components/MhvAlertConfirmEmail/AlertConfirmAddContactEmailError';

describe('AlertConfirmAddContactEmailError />', () => {
  it('renders email text, email address, Confirm button, and Edit link', async () => {
    const recordEvent = sinon.spy();

    const { container, findByText } = render(
      <AlertConfirmAddContactEmailError
        emailAddress="vet@va.gov"
        onConfirmClick={() => {}}
        recordEvent={recordEvent}
      />,
    );

    await findByText(
      /We’ll send notifications about your VA health care and benefits to this email\./i,
    );

    await findByText('vet@va.gov');

    await findByText('Please try again.');

    const confirmButton = container.querySelector('va-button[text="Confirm"]');
    expect(confirmButton).to.exist;

    const link = container.querySelector(
      'va-link[text="Go to profile to update your contact email"]',
    );
    expect(link).to.exist;
    expect(link.getAttribute('href')).to.equal(
      '/profile/contact-information#contact-email-address',
    );

    expect(recordEvent.calledOnce).to.be.true;
    expect(recordEvent.calledWith('We couldn’t confirm your contact email')).to
      .be.true;
  });

  it('calls onConfirmClick when the Confirm button is clicked', async () => {
    const onConfirmClick = sinon.spy();

    const { container } = render(
      <AlertConfirmAddContactEmailError
        emailAddress="vet@va.gov"
        onConfirmClick={onConfirmClick}
        recordEvent={() => {}}
      />,
    );

    const button = container.querySelector('va-button[text="Confirm"]');
    expect(button).to.exist;

    fireEvent.click(button);

    await waitFor(async () => {
      expect(onConfirmClick.calledOnce).to.be.true;
    });
  });
});
