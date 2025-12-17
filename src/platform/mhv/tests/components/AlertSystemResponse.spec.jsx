import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  AlertSystemResponseConfirmSuccess,
  AlertSystemResponseSkipSuccess,
} from '../../components/MhvAlertConfirmEmail/AlertSystemResponse';

describe('AlertSystemResponse components', () => {
  describe('AlertSystemResponseConfirmSuccess', () => {
    it('renders success alert with correct headline and content', async () => {
      const recordEvent = sinon.spy();

      const { container, findByText } = render(
        <AlertSystemResponseConfirmSuccess recordEvent={recordEvent} />,
      );

      await findByText('Thank you for confirming your contact email address');

      await findByText(
        /You can update the email address we have on file for you at any time in your VA\.gov profile\./i,
      );

      const alert = container.querySelector('va-alert[status="success"]');
      expect(alert).to.exist;
      expect(alert.getAttribute('data-testid')).to.equal(
        'mhv-alert--confirm-success',
      );

      expect(recordEvent.calledOnce).to.be.true;
      expect(
        recordEvent.calledWith(
          'Thank you for confirming your contact email address',
        ),
      ).to.be.true;
    });

    it('renders h2 heading by default', () => {
      const { container } = render(
        <AlertSystemResponseConfirmSuccess recordEvent={() => {}} />,
      );

      const heading = container.querySelector('h2[slot="headline"]');
      expect(heading).to.exist;
      expect(heading.textContent).to.include(
        'Thank you for confirming your contact email address',
      );
    });

    it('renders h3 heading', () => {
      const { container } = render(
        <AlertSystemResponseConfirmSuccess
          recordEvent={() => {}}
          headingLevel="h3"
        />,
      );

      const heading = container.querySelector('h3[slot="headline"]');
      expect(heading).to.exist;
      expect(heading.textContent).to.include(
        'Thank you for confirming your contact email address',
      );
    });
  });

  describe('AlertSystemResponseSkipSuccess', () => {
    it('renders success alert with correct headline and content', async () => {
      const recordEvent = sinon.spy();

      const { container, findByText } = render(
        <AlertSystemResponseSkipSuccess recordEvent={recordEvent} />,
      );

      await findByText('Okay, we’ll skip adding a contact email for now');

      await findByText(
        /You can update the email address we have on file for you at any time in your VA.gov profile./,
      );

      const alert = container.querySelector('va-alert[status="success"]');
      expect(alert).to.exist;
      expect(alert.getAttribute('data-testid')).to.equal(
        'mhv-alert--skip-success',
      );

      expect(recordEvent.calledOnce).to.be.true;
      expect(
        recordEvent.calledWith(
          'Okay, we’ll skip adding a contact email for now',
        ),
      ).to.be.true;
    });

    it('renders h2 heading by default', () => {
      const { container } = render(
        <AlertSystemResponseSkipSuccess recordEvent={() => {}} />,
      );

      const heading = container.querySelector('h2[slot="headline"]');
      expect(heading).to.exist;
      expect(heading.textContent).to.include(
        'Okay, we’ll skip adding a contact email for now',
      );
    });

    it('renders h3 heading', () => {
      const { container } = render(
        <AlertSystemResponseSkipSuccess
          recordEvent={() => {}}
          headingLevel="h3"
        />,
      );

      const heading = container.querySelector('h3[slot="headline"]');
      expect(heading).to.exist;
      expect(heading.textContent).to.include(
        'Okay, we’ll skip adding a contact email for now',
      );
    });

    it('includes screen reader only status text', () => {
      const { container } = render(
        <AlertSystemResponseSkipSuccess recordEvent={() => {}} />,
      );

      const srOnly = container.querySelector('.usa-sr-only');
      expect(srOnly).to.exist;
      expect(srOnly.textContent).to.equal('success');
    });
  });
});
