import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderInReduxProvider as render } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import AlertConfirmContactEmailContent from 'platform/mhv/components/MhvAlertConfirmEmail/AlertConfirmContactEmailContent';

describe('<AlertConfirmContactEmailContent />', () => {
  it('renders email text, email address, Confirm button, and Edit link', async () => {
    const { container, getByText } = render(
      <AlertConfirmContactEmailContent
        emailAddress="vet@va.gov"
        onConfirmClick={() => {}}
      />,
    );

    await waitFor(() => {
      // Intro text
      getByText(
        /We’ll send notifications about your VA health care and benefits to this email\./i,
      );

      // Email address (bold paragraph)
      getByText('vet@va.gov');

      // Confirm button (VA web component)
      const confirmButton = container.querySelector(
        'va-button[text="Confirm"]',
      );
      expect(confirmButton).to.exist;

      // Edit link
      const link = container.querySelector(
        'va-link[text="Edit your email address"]',
      );
      expect(link).to.exist;
      expect(link.getAttribute('href')).to.equal(
        '/profile/contact-information#contact-email-address',
      );
    });
  });

  it('calls onConfirmClick when the Confirm button is clicked', async () => {
    const onConfirmClick = sinon.spy();

    const { container } = render(
      <AlertConfirmContactEmailContent
        emailAddress="vet@va.gov"
        onConfirmClick={onConfirmClick}
      />,
    );

    await waitFor(() => {
      const button = container.querySelector('va-button[text="Confirm"]');
      expect(button).to.exist;

      fireEvent.click(button);
      expect(onConfirmClick.calledOnce).to.be.true;
    });
  });
});
