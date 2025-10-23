/**
 * @module tests/pages/claimant-contact-review.unit.spec
 * @description Unit tests for ClaimantContactReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ClaimantContactReviewPage } from './claimant-contact-review';

describe('ClaimantContactReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Claimant contact information';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <ClaimantContactReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <ClaimantContactReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Claimant contact information');
    });

    it('should render edit button', () => {
      const { container } = render(
        <ClaimantContactReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });

  describe('Data Display', () => {
    it('should display all claimant contact information', () => {
      const data = {
        claimantContact: {
          claimantPhoneNumber: '555-123-4567',
          claimantMobilePhone: '555-987-6543',
          claimantEmail: 'claimant@example.com',
        },
      };

      const { container } = render(
        <ClaimantContactReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('555-123-4567');
      expect(container.textContent).to.include('555-987-6543');
      expect(container.textContent).to.include('claimant@example.com');
    });

    it('should display only phone number', () => {
      const data = {
        claimantContact: {
          claimantPhoneNumber: '555-111-2222',
        },
      };

      const { container } = render(
        <ClaimantContactReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('555-111-2222');
    });

    it('should display only mobile phone', () => {
      const data = {
        claimantContact: {
          claimantMobilePhone: '555-333-4444',
        },
      };

      const { container } = render(
        <ClaimantContactReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('555-333-4444');
    });

    it('should display only email', () => {
      const data = {
        claimantContact: {
          claimantEmail: 'test@va.gov',
        },
      };

      const { container } = render(
        <ClaimantContactReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('test@va.gov');
    });

    it('should display phone and email without mobile', () => {
      const data = {
        claimantContact: {
          claimantPhoneNumber: '555-555-5555',
          claimantEmail: 'veteran@example.com',
        },
      };

      const { container } = render(
        <ClaimantContactReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('555-555-5555');
      expect(container.textContent).to.include('veteran@example.com');
    });

    it('should display mobile and email without phone', () => {
      const data = {
        claimantContact: {
          claimantMobilePhone: '555-777-8888',
          claimantEmail: 'contact@example.com',
        },
      };

      const { container } = render(
        <ClaimantContactReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('555-777-8888');
      expect(container.textContent).to.include('contact@example.com');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <ClaimantContactReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle missing claimantContact section', () => {
      const data = {
        someOtherSection: {},
      };

      const { container } = render(
        <ClaimantContactReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should handle empty claimantContact object', () => {
      const data = {
        claimantContact: {},
      };

      const { container } = render(
        <ClaimantContactReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Edit Functionality', () => {
    it('should pass editPage prop correctly', () => {
      const customEditPage = () => {};
      const { container } = render(
        <ClaimantContactReviewPage
          data={{}}
          editPage={customEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });
});
