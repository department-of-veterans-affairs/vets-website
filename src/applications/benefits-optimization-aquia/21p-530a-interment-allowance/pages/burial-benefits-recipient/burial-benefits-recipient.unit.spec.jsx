/**
 * @module tests/pages/burial-benefits-recipient.unit.spec
 * @description Unit tests for BurialBenefitsRecipientPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { BurialBenefitsRecipientPage } from './burial-benefits-recipient';

describe('BurialBenefitsRecipientPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <BurialBenefitsRecipientPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Burial benefits recipient');
    });

    it('should render all form fields', () => {
      const { container } = render(
        <BurialBenefitsRecipientPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input[label="Full name"]')).to
        .exist;
      expect(
        container.querySelector('va-telephone-input[label="Phone number"]'),
      ).to.exist;
    });

    it('should show instruction text', () => {
      const { container } = render(
        <BurialBenefitsRecipientPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.textContent).to.include(
        'This is the organization who will be receiving compensation',
      );
    });
  });

  describe('Data Handling', () => {
    it('should render with existing recipient data', () => {
      const existingData = {
        recipientOrganizationName: 'New Republic Veterans Affairs Office',
        recipientPhone: '5550138666',
      };

      const { container } = render(
        <BurialBenefitsRecipientPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <BurialBenefitsRecipientPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });
  });

  describe('Navigation', () => {
    it('should render continue button', () => {
      const { container } = render(
        <BurialBenefitsRecipientPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const continueButton = container.querySelector(
        'va-button[text="Continue"]',
      );
      expect(continueButton).to.exist;
    });

    it('should render back button when goBack is provided', () => {
      const { container } = render(
        <BurialBenefitsRecipientPage
          goForward={mockGoForward}
          goBack={mockGoBack}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      const backButton = container.querySelector('va-button[text="Back"]');
      expect(backButton).to.exist;
    });
  });

  describe('Review Mode', () => {
    it('should render save button instead of continue in review mode', () => {
      const { container } = render(
        <BurialBenefitsRecipientPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
          onReviewPage
          updatePage={mockUpdatePage}
        />,
      );

      const saveButton = container.querySelector('va-button[text="Save"]');
      const continueButton = container.querySelector(
        'va-button[text="Continue"]',
      );

      expect(saveButton).to.exist;
      expect(continueButton).to.not.exist;
    });
  });
});
