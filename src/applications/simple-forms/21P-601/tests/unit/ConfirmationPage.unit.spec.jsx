import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { expect } from 'chai';

import ConfirmationPage from '../../containers/ConfirmationPage';

describe('21P-601 ConfirmationPage', () => {
  afterEach(() => {
    cleanup();
  });

  describe('basic rendering', () => {
    it('should render successfully', () => {
      const { container } = render(<ConfirmationPage />);
      expect(container).to.exist;
    });

    it('should render success alert with correct status', () => {
      const { container } = render(<ConfirmationPage />);

      const alert = container.querySelector('va-alert');
      expect(alert).to.exist;
      expect(alert).to.have.attr('status', 'success');
      expect(alert).to.have.attr('uswds');
    });

    it('should display correct heading in alert', () => {
      const { container } = render(<ConfirmationPage />);

      const alert = container.querySelector('va-alert');
      expect(alert.textContent).to.include("We've received your form");
    });

    it('should display thank you message', () => {
      const { getByText } = render(<ConfirmationPage />);

      getByText(/Thank you for submitting 21P-601/i);
    });

    it('should have confirmation-page class', () => {
      const { container } = render(<ConfirmationPage />);

      const confirmationDiv = container.querySelector('.confirmation-page');
      expect(confirmationDiv).to.exist;
    });
  });

  describe('content verification', () => {
    it('should include form number in thank you message', () => {
      const { container } = render(<ConfirmationPage />);

      expect(container.textContent).to.include('21P-601');
    });

    it('should render alert before thank you message', () => {
      const { container } = render(<ConfirmationPage />);

      const alert = container.querySelector('va-alert');
      const paragraph = container.querySelector('p');

      // Alert should come before paragraph in DOM
      expect(alert).to.exist;
      expect(paragraph).to.exist;
      expect(alert.compareDocumentPosition(paragraph)).to.equal(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });

    it('should have h2 heading in alert slot', () => {
      const { container } = render(<ConfirmationPage />);

      const heading = container.querySelector('h2[slot="headline"]');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal("We've received your form");
    });
  });

  describe('accessibility', () => {
    it('should use semantic HTML structure', () => {
      const { container } = render(<ConfirmationPage />);

      const alert = container.querySelector('va-alert');
      const heading = container.querySelector('h2');

      expect(alert).to.exist;
      expect(heading).to.exist;
    });

    it('should have proper heading hierarchy', () => {
      const { container } = render(<ConfirmationPage />);

      const h2 = container.querySelector('h2');
      expect(h2).to.exist;
      expect(h2.textContent).to.equal("We've received your form");
    });
  });

  describe('component structure', () => {
    it('should render with minimal props', () => {
      // Component doesn't require any props
      const { container } = render(<ConfirmationPage />);
      expect(container).to.exist;
      expect(container.querySelector('.confirmation-page')).to.exist;
    });

    it('should contain exactly one alert element', () => {
      const { container } = render(<ConfirmationPage />);

      const alerts = container.querySelectorAll('va-alert');
      expect(alerts.length).to.equal(1);
    });

    it('should contain exactly one paragraph element', () => {
      const { container } = render(<ConfirmationPage />);

      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs.length).to.equal(1);
    });
  });
});
