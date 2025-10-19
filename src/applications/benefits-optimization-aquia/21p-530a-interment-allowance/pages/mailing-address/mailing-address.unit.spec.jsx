/**
 * @module tests/pages/mailing-address.unit.spec
 * @description Unit tests for MailingAddressPage component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { MailingAddressPage } from './mailing-address';

describe('MailingAddressPage', () => {
  const mockGoForward = () => {};
  const mockGoBack = () => {};
  const mockSetFormData = () => {};
  const mockUpdatePage = () => {};

  describe('Initial Rendering', () => {
    it('should render without errors', () => {
      const { container } = render(
        <MailingAddressPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      expect(container).to.exist;
      expect(container.textContent).to.include('Mailing address');
    });

    it('should render address fields', () => {
      const { container } = render(
        <MailingAddressPage
          goForward={mockGoForward}
          data={{}}
          setFormData={mockSetFormData}
        />,
      );

      // AddressField component renders multiple fields
      expect(container.querySelector('va-text-input[label="Street address"]'))
        .to.exist;
      expect(
        container.querySelector('va-text-input[label="Street address line 2"]'),
      ).to.exist;
      expect(container.querySelector('va-text-input[label="City"]')).to.exist;
    });
  });

  describe('Data Handling', () => {
    it('should render with existing address data', () => {
      const existingData = {
        recipientAddress: {
          street: '1138 Temple Way',
          street2: 'High Council Chambers',
          city: 'Coruscant City',
          state: 'DC',
          country: 'USA',
          postalCode: '20001',
          isMilitary: false,
        },
      };

      const { container } = render(
        <MailingAddressPage
          goForward={mockGoForward}
          data={existingData}
          setFormData={mockSetFormData}
        />,
      );

      expect(container.querySelector('va-text-input')).to.exist;
    });

    it('should handle empty data gracefully', () => {
      const { container } = render(
        <MailingAddressPage
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
        <MailingAddressPage
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
        <MailingAddressPage
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
        <MailingAddressPage
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
