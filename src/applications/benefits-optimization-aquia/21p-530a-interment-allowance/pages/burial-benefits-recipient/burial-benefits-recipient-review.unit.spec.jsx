/**
 * @module tests/pages/burial-benefits-recipient-review.unit.spec
 * @description Unit tests for BurialBenefitsRecipientReviewPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { BurialBenefitsRecipientReviewPage } from './burial-benefits-recipient-review';

describe('BurialBenefitsRecipientReviewPage', () => {
  const mockEditPage = () => {};
  const mockTitle = 'Burial benefits recipient';

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <BurialBenefitsRecipientReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });

    it('should render title', () => {
      const { container } = render(
        <BurialBenefitsRecipientReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Burial benefits recipient');
    });
  });

  describe('Data Display', () => {
    it('should display recipient organization name', () => {
      const data = {
        burialBenefitsRecipient: {
          recipientOrganizationName: 'Test Organization',
          recipientPhone: '1234567890',
        },
      };

      const { container } = render(
        <BurialBenefitsRecipientReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('Test Organization');
    });

    it('should display formatted phone number', () => {
      const data = {
        burialBenefitsRecipient: {
          recipientPhone: '1234567890',
        },
      };

      const { container } = render(
        <BurialBenefitsRecipientReviewPage
          data={data}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container.textContent).to.include('123-456-7890');
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <BurialBenefitsRecipientReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      expect(container).to.exist;
    });
  });

  describe('Edit Functionality', () => {
    it('should render edit button', () => {
      const { container } = render(
        <BurialBenefitsRecipientReviewPage
          data={{}}
          editPage={mockEditPage}
          title={mockTitle}
        />,
      );

      const editButton = container.querySelector('va-button');
      expect(editButton).to.exist;
    });
  });
});
